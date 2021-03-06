package com.icesoft.msdb.service.impl;

import java.time.*;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

import com.icesoft.msdb.MSDBException;
import com.icesoft.msdb.domain.EventSession;
import com.icesoft.msdb.repository.EventSessionRepository;
import com.icesoft.msdb.service.SearchService;
import org.elasticsearch.index.query.QueryBuilder;
import org.elasticsearch.index.query.QueryBuilders;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.cache.annotation.CacheEvict;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.icesoft.msdb.domain.Event;
import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.repository.EventEditionRepository;
import com.icesoft.msdb.repository.EventRepository;
import com.icesoft.msdb.repository.search.EventSearchRepository;
import com.icesoft.msdb.service.EventService;
import com.icesoft.msdb.service.dto.EditionIdYearDTO;

/**
 * Service Implementation for managing Events.
 */
@Service
@Transactional
public class EventServiceImpl implements EventService {

    private final Logger log = LoggerFactory.getLogger(EventServiceImpl.class);

    private final EventRepository eventRepository;
    private final EventEditionRepository eventEditionRepository;
    private final EventSessionRepository eventSessionRepository;
    private final EventSearchRepository eventSearchRepo;
    private final SearchService searchService;

    public EventServiceImpl(EventRepository eventRepository,
    			EventEditionRepository eventEditionRepository,
    			EventSearchRepository eventSearchRepo,
                EventSessionRepository eventSessionRepository,
                SearchService searchService) {
    	this.eventRepository = eventRepository;
    	this.eventEditionRepository = eventEditionRepository;
    	this.eventSearchRepo = eventSearchRepo;
    	this.eventSessionRepository = eventSessionRepository;
    	this.searchService = searchService;
    }

    /**
     * Save a racetrack.
     *
     * @param event the entity to save
     * @return the persisted entity
     */
    @Override
    public Event save(Event event) {
        log.debug("Request to save Event : {}", event);
        Event result = eventRepository.save(event);
        eventSearchRepo.save(result);
        return result;
    }

    /**
     *  Get all the racetracks.
     *
     *  @param pageable the pagination information
     *  @return the list of entities
     */
    @Override
    @Transactional(readOnly = true)
    public Page<Event> findAll(Optional<String> query, Pageable pageable) {
        log.debug("Request to get all Events");
        Page<Event> page;
        if (query.isPresent()) {
            page = searchService.performWildcardSearch(eventSearchRepo, query.get().toLowerCase(), new String[]{"name", "description"}, pageable);
        } else {
            page = eventRepository.findAll(pageable);
        }
        return page;
    }

    /**
     *  Get one racetrack by id.
     *
     *  @param id the id of the entity
     *  @return the entity
     */
    @Override
    @Transactional(readOnly = true)
    public Event findOne(Long id) {
        log.debug("Request to get Event : {}", id);
        return eventRepository.findById(id)
            .orElseThrow(() -> new MSDBException("Invalid event id " + id));
    }

    /**
     *  Delete the  racetrack by id.
     *
     *  @param id the id of the entity
     */
    @Override
    public void delete(Long id) {
        log.debug("Request to delete Event : {}", id);
        eventRepository.deleteById(id);
        eventSearchRepo.deleteById(id);
    }

    @Override
    public Page<Event> search(String query, Pageable pageable) {
    	QueryBuilder queryBuilder = QueryBuilders.boolQuery().should(
    			QueryBuilders.queryStringQuery("*" + query.toLowerCase() + "*")
    				.analyzeWildcard(true)
    				.field("name"));

    	return eventSearchRepo.search(queryBuilder, pageable);
    }

    @Override
    public Page<EventEdition> findEventEditions(Long idEvent, Pageable pageable) {
    	Page<EventEdition> result = eventEditionRepository.findByEventId(idEvent, pageable);
    	return result;
    }

	@Override
	@Transactional(readOnly=true)
	public List<EditionIdYearDTO> findEventEditionsIdYear(Long idEvent) {
		return eventEditionRepository.findEventEditionsIdYear(idEvent)
				.stream()
				.map(e -> new EditionIdYearDTO((Long)e[0], (Integer)e[1]))
				.collect(Collectors.<EditionIdYearDTO> toList());
	}

	@Override
    @Transactional
    @CacheEvict(cacheNames="calendar", allEntries=true)
    public EventEdition rescheduleEvent(EventEdition event, LocalDate newDate) {
        log.debug("Rescheduling event {}", event.getLongEventName());
        long daysBetween = ChronoUnit.DAYS.between(event.getEventDate(), newDate);
        log.trace("Days between: {}", daysBetween);
        List<EventSession> sessions = eventSessionRepository.findByEventEditionIdOrderBySessionStartTimeAsc(event.getId());
        sessions.forEach(session -> {
            LocalDateTime time = LocalDateTime.ofInstant(Instant.ofEpochSecond(session.getSessionStartTime()), ZoneId.of("UTC"));
            log.trace("Original time for session {}: {}", session.getName(), time);
            time = time.plusDays(daysBetween);
            log.trace("New time: {}", time);
            session.setSessionStartTime(time.toEpochSecond(ZoneOffset.UTC));
        });
        event.setEventDate(event.getEventDate().plusDays(daysBetween));
        eventSessionRepository.saveAll(sessions);
        return event;
    }
}
