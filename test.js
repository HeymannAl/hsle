let JSONItems={
  "topics": [
    {
      "id": "thema_1",
      "title": "Videokonferenzen",
      "type": "Thema",
      "url": "https://inside.fhnw.ch/hsle2025/Seiten/Videoconfs.aspx",
      "related": [{"scenarios":["scenario_1", "scenario_2"]}, {"tools":["tool_1", "tool_2"]}]
    },
    {
      "id": "thema_2",
      "title": "Videokonferenzen2",
      "type": "Thema",
      "url": "https://inside.fhnw.ch/hsle2025/Seiten/Videoconfs.aspx",
      "related": [{"scenarios":["scenario_1", "scenario_2"]}, {"tools":["tool_1"]}]
    }
  ],
  "scenarios": [
    {
      "id" : "scenario_1",
      "title": "Blended Learning",
      "type": "scenario",
      "url": "...",
      "related": [{"tools":["tool_2"]}]
    },
    {
      "id": "scenario_2",
      "title": "Webinar",
      "type": "scenario",
      "url": "...",
      "related": [{ "topics" : [ "thema_1" , "thema_2"],"tools":["tool_2"]}]
    }
  ],
  "tools": [
    {
      "id" : "tool_1",
      "title": "SwitchVideoConferenceTool",
      "type": "tool",
      "url": "...",
      "related": [{ "topics" : [ "thema_1" , "thema_2"],"tools":["tool_2"]}]
    },
    {
      "id" : "tool_2",
      "title": "SwitchVideoConferenceTool",
      "type": "tool",
      "url": "...",
      "related": [{ "topics" : [ "thema_1" , "thema_2"],"tools":["tool_2"]}]
    }
  ]
}