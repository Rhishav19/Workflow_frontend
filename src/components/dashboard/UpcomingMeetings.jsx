const meetings = [
  {
    id: 1,
    title: "Sprint Planning",
    date: "Today",
    time: "2:00 PM",
  },
  {
    id: 2,
    title: "Client Presentation",
    date: "Tomorrow",
    time: "10:30 AM",
  },
  {
    id: 3,
    title: "Design Review",
    date: "Friday",
    time: "4:00 PM",
  },
];

const UpcomingMeetings = () => {
  return (
    <div className="bg-white rounded-2xl shadow-md p-6">
      <h2 className="text-xl font-bold mb-6">
        Upcoming Meetings
      </h2>

      <div className="space-y-4">
        {meetings.map((meeting) => (
          <div
            key={meeting.id}
            className="border rounded-xl p-4 hover:bg-gray-50 transition"
          >
            <h3 className="font-semibold">{meeting.title}</h3>

            <p className="text-sm text-gray-500 mt-1">
              {meeting.date} • {meeting.time}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UpcomingMeetings;