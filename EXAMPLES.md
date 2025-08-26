# ElevenLabs Music Node Examples

This document provides practical examples of how to use the ElevenLabs Music node in your n8n workflows.

## Basic Workflow Examples

### 1. Simple Music Generation

This workflow generates a 30-second music track from a text prompt.

**Workflow:**
1. **Manual Trigger** → **ElevenLabs Music**

**ElevenLabs Music Configuration:**
```json
{
  "operation": "generateMusic",
  "prompt": "Create a relaxing ambient track with soft piano and gentle strings",
  "musicLengthSeconds": 30,
  "outputFormat": "mp3_44100_128"
}
```

**Output:**
- `audioData`: Base64-encoded audio file
- `outputFormat`: "mp3_44100_128"
- `prompt`: Original prompt text
- `musicLengthMs`: 30000

### 2. Dynamic Music Generation from User Input

This workflow takes user input and generates music based on their description.

**Workflow:**
1. **Webhook** → **ElevenLabs Music** → **Respond to Webhook**

**Webhook Configuration:**
- HTTP Method: POST
- Response Mode: Respond When Last Node Finishes

**ElevenLabs Music Configuration:**
```json
{
  "operation": "generateMusic",
  "prompt": "={{ $json.body.musicDescription }}",
  "musicLengthSeconds": "={{ $json.body.duration || 30 }}",
  "outputFormat": "mp3_44100_128"
}
```

**Respond to Webhook Configuration:**
```json
{
  "responseBody": {
    "success": true,
    "audioData": "={{ $json.audioData }}",
    "format": "={{ $json.outputFormat }}"
  }
}
```

### 3. Composition Plan Workflow

This workflow first creates a composition plan, then uses it to generate music.

**Workflow:**
1. **Manual Trigger** → **ElevenLabs Music (Plan)** → **ElevenLabs Music (Generate)**

**Step 1 - Create Composition Plan:**
```json
{
  "operation": "createCompositionPlan",
  "planPrompt": "Epic orchestral battle music with rising tension and heroic themes",
  "planMusicLengthSeconds": 60
}
```

**Step 2 - Generate Music from Plan:**
```json
{
  "operation": "generateMusic",
  "additionalOptions": {
    "useCompositionPlan": true,
    "compositionPlan": "={{ JSON.stringify($('ElevenLabs Music').item.json.compositionPlan) }}"
  }
}
```

### 4. Batch Music Generation

This workflow generates multiple music tracks from a list of prompts.

**Workflow:**
1. **Manual Trigger** → **Code** → **Split In Batches** → **ElevenLabs Music** → **Merge**

**Code Node (Generate Prompts):**
```javascript
const prompts = [
  "Upbeat electronic dance music with heavy bass",
  "Calm acoustic guitar melody for relaxation",
  "Dramatic orchestral piece with crescendo",
  "Jazz fusion with saxophone and piano"
];

return prompts.map((prompt, index) => ({
  json: {
    id: index + 1,
    prompt: prompt,
    duration: 30
  }
}));
```

**ElevenLabs Music Configuration:**
```json
{
  "operation": "generateMusic",
  "prompt": "={{ $json.prompt }}",
  "musicLengthSeconds": "={{ $json.duration }}",
  "outputFormat": "mp3_44100_128"
}
```

### 5. Music Generation with File Storage

This workflow generates music and saves it to a file system or cloud storage.

**Workflow:**
1. **Manual Trigger** → **ElevenLabs Music** → **Code** → **HTTP Request** (to cloud storage)

**ElevenLabs Music Configuration:**
```json
{
  "operation": "generateMusicDetailed",
  "prompt": "Cinematic soundtrack for a sci-fi movie scene",
  "musicLengthSeconds": 45,
  "outputFormat": "mp3_44100_192"
}
```

**Code Node (Prepare for Upload):**
```javascript
// Convert base64 to buffer for file upload
const audioBuffer = Buffer.from($json.audioData, 'base64');
const filename = `music_${Date.now()}.mp3`;

return [{
  json: {
    filename: filename,
    contentType: 'audio/mpeg',
    originalData: $json
  },
  binary: {
    data: {
      data: audioBuffer,
      mimeType: 'audio/mpeg',
      fileName: filename
    }
  }
}];
```

## Advanced Examples

### 6. Conditional Music Generation

This workflow generates different types of music based on input conditions.

**Workflow:**
1. **Webhook** → **Switch** → **ElevenLabs Music** (multiple branches)

**Switch Configuration:**
- Mode: Rules
- Rules based on `{{ $json.body.mood }}`

**Branch 1 (Happy):**
```json
{
  "operation": "generateMusic",
  "prompt": "Upbeat and joyful music with bright melodies and energetic rhythm",
  "musicLengthSeconds": 30,
  "outputFormat": "mp3_44100_128"
}
```

**Branch 2 (Sad):**
```json
{
  "operation": "generateMusic",
  "prompt": "Melancholic and emotional music with minor keys and slow tempo",
  "musicLengthSeconds": 30,
  "outputFormat": "mp3_44100_128"
}
```

### 7. Music Generation with Metadata Processing

This workflow generates music and processes the metadata for further use.

**Workflow:**
1. **Manual Trigger** → **ElevenLabs Music** → **Code** → **HTTP Request** (to database)

**ElevenLabs Music Configuration:**
```json
{
  "operation": "generateMusicDetailed",
  "prompt": "{{ $json.prompt }}",
  "musicLengthSeconds": 60,
  "outputFormat": "mp3_44100_128"
}
```

**Code Node (Process Metadata):**
```javascript
const musicData = $json;

// Extract and process metadata
const processedData = {
  id: Date.now(),
  prompt: musicData.prompt,
  duration: musicData.musicLengthMs / 1000,
  format: musicData.outputFormat,
  generated_at: new Date().toISOString(),
  file_size: Math.round(musicData.audioData.length * 0.75), // Approximate size
  metadata: musicData.metadata || {}
};

return [{
  json: processedData
}];
```

### 8. Error Handling and Retry Logic

This workflow includes error handling and retry mechanisms.

**Workflow:**
1. **Manual Trigger** → **ElevenLabs Music** → **IF** → **Wait** → **ElevenLabs Music** (retry)

**ElevenLabs Music Configuration:**
```json
{
  "operation": "generateMusic",
  "prompt": "{{ $json.prompt }}",
  "musicLengthSeconds": 30,
  "outputFormat": "mp3_44100_128",
  "continueOnFail": true
}
```

**IF Node Configuration:**
- Condition: `{{ $json.error !== undefined }}`

**Wait Node (for retry):**
- Amount: 5 seconds

## Integration Examples

### 9. Discord Bot Integration

Generate music and send it to a Discord channel.

**Workflow:**
1. **Discord Trigger** → **ElevenLabs Music** → **Code** → **Discord**

**Discord Configuration:**
- Send audio file as attachment
- Include metadata in message

### 10. Slack Integration

Generate music based on Slack commands.

**Workflow:**
1. **Slack Trigger** → **ElevenLabs Music** → **Slack**

**Slack Response:**
```json
{
  "text": "🎵 Generated music: {{ $json.prompt }}",
  "attachments": [
    {
      "title": "Generated Music",
      "text": "Duration: {{ $json.musicLengthMs / 1000 }}s | Format: {{ $json.outputFormat }}"
    }
  ]
}
```

## Tips and Best Practices

### Performance Optimization
- Use shorter durations for testing (10-15 seconds)
- Choose appropriate output formats based on quality needs
- Implement caching for frequently requested music styles

### Error Handling
- Always enable "Continue on Fail" for production workflows
- Implement retry logic with exponential backoff
- Log errors for debugging and monitoring

### Cost Management
- Monitor API usage and costs
- Use composition plans for complex requirements
- Cache generated music to avoid regeneration

### Quality Improvement
- Use detailed and specific prompts
- Experiment with composition plans for better control
- Test different output formats for your use case

## Troubleshooting

### Common Issues

1. **API Key Issues**
   - Ensure API key is valid and has Music API access
   - Check that you have a paid ElevenLabs account

2. **Audio Quality**
   - Use higher bitrate formats for better quality
   - Ensure prompts are descriptive and specific

3. **Timeout Issues**
   - Longer music generation may take more time
   - Implement appropriate timeout settings

4. **Rate Limiting**
   - Implement delays between requests
   - Use composition plan creation (free) for planning

### Debug Tips

1. **Test with Simple Prompts**
   ```json
   {
     "operation": "generateMusic",
     "prompt": "Simple piano melody",
     "musicLengthSeconds": 10,
     "outputFormat": "mp3_44100_128"
   }
   ```

2. **Check API Response**
   - Enable debug mode in n8n
   - Check the raw API response for errors

3. **Validate Credentials**
   - Test credentials with the "Create Composition Plan" operation first
   - Verify API key permissions in ElevenLabs dashboard

