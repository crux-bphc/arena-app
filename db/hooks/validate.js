// Pocketbase hooks seem to have a weird problem with JSON feilds, so strings are just passed directly,
// indicating an error has occured when validating
const validate = ({ collectionName, startTime, endTime }) => {
	// Validate events records
	if (collectionName == "events") {
		let [startTimeMs, endTimeMs] = [new Date(startTime).getTime(), new Date(endTime).getTime()];
		if (startTimeMs > endTimeMs) {
			return "The start time of the event is after the end time!";
		} else if (startTimeMs == endTimeMs) {
			return "The start time of the event is equal to the end time!";
		}
	}
	// Assume everything else is always valid
	return null;
};

module.exports = {
	validate,
};
