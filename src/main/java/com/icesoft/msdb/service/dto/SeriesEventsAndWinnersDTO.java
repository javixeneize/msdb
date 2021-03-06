package com.icesoft.msdb.service.dto;

import java.time.LocalDate;
import java.util.List;

import com.icesoft.msdb.domain.EventEdition;
import com.icesoft.msdb.domain.enums.EventStatusType;

public class SeriesEventsAndWinnersDTO {

	private final EventEdition eventEdition;
	private final List<SessionWinnersDTO> winners;

	public SeriesEventsAndWinnersDTO(EventEdition eventEdition, List<SessionWinnersDTO> winners) {
		this.eventEdition = eventEdition;
		this.winners = winners;
	}

	public Long getId() {
		return eventEdition.getId();
	}
	public String getEventEditionName() {
		return eventEdition.getLongEventName();
	}
	public EventStatusType getStatus() { return eventEdition.getStatus(); }
	public LocalDate getEventEditionDate() {
		return eventEdition.getEventDate();
	}
	public List<SessionWinnersDTO> getWinners() {
		return winners;
	}
	public String getEventEditionPosterUrl() { return eventEdition.getPosterUrl(); }
	public String getRacetrackLogoUrl() { return eventEdition.getTrackLayout().getRacetrack().getLogoUrl(); }
    public String getRacetrackLayoutUrl() { return eventEdition.getTrackLayout().getLayoutImageUrl(); }
}
