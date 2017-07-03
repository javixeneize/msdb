package com.icesoft.msdb.domain;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.TreeMap;

import org.springframework.data.annotation.Id;
import org.springframework.data.annotation.Transient;

import com.fasterxml.jackson.annotation.JsonIgnore;

public class SessionLapData {

	@Id
	private String sessionId;
	
	@Transient
	private Map<String, List<LapInfo>> entriesLapByLap = new TreeMap<>();
	@Transient
	private Map<String, List<LapInfo>> driversLapByLap = new TreeMap<>();
	
	private List<LapInfo> laps = new ArrayList<>();
	
	public void addLapData(LapInfo lapData, Boolean multidriver) {
		List<LapInfo> entryLapByLap;
		List<LapInfo> driverLapByLap;
		if (!entriesLapByLap.containsKey(lapData.getRaceNumber())) {
   			entryLapByLap = new ArrayList<>();
   			entriesLapByLap.put(lapData.getRaceNumber(), entryLapByLap);
   		}
   		entryLapByLap = entriesLapByLap.get(lapData.getRaceNumber());
   		entryLapByLap.add(lapData);
   		
   		if (multidriver) {
   			if (!driversLapByLap.containsKey(lapData.getDriverName())) {
   				driverLapByLap = new ArrayList<>();
   				driversLapByLap.put(lapData.getDriverName(), driverLapByLap);
   			}
   			driverLapByLap = driversLapByLap.get(lapData.getDriverName());
   			driverLapByLap.add(lapData);
   		}
   		
   		laps.add(lapData);
   		
	}
	
	public List<LapInfo> getLaps() {
		return laps;
	}
	
	@JsonIgnore
	public List<LapInfo> getEntryLaps(String entryNumber) {
		return entriesLapByLap.get(entryNumber);
	}
	
	@JsonIgnore
	public List<LapInfo> getDriverLaps(String driverName) {
		return driversLapByLap.get(driverName);
	}

	@JsonIgnore
	public String getSessionId() {
		return sessionId;
	}

	public void setSessionId(String id) {
		this.sessionId = id;
	}
	
	
}
