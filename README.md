# n8n-nodes-elevenlabs-music

This is an n8n community node that provides integration with ElevenLabs' Music API, allowing you to generate music using AI directly within your n8n workflows.

![n8n.io - Workflow Automation](https://raw.githubusercontent.com/n8n-io/n8n/master/assets/n8n-logo.png)

## Table of Contents

- [Installation](#installation)
- [Operations](#operations)
- [Credentials](#credentials)
- [Usage Examples](#usage-examples)
- [Compatibility](#compatibility)
- [Resources](#resources)
- [Version History](#version-history)

## Installation

Follow the [installation guide](https://docs.n8n.io/integrations/community-nodes/installation/) in the n8n community nodes documentation.

### Community Nodes (Recommended)

1. Go to **Settings > Community Nodes**.
2. Select **Install**.
3. Enter `n8n-nodes-elevenlabs-music` in **Enter npm package name**.
4. Agree to the [risks](https://docs.n8n.io/integrations/community-nodes/risks/) of using community nodes: select **I understand the risks of installing unverified code from a public source**.
5. Select **Install**.

After installing the node, you can use it like any other node. n8n displays the node in search results in the **Nodes** panel.

### Manual Installation

To get started install the package in your n8n root directory:

```bash
npm install n8n-nodes-elevenlabs-music
```

For Docker-based deployments add the following line before the font installation command in your [n8n Dockerfile](https://github.com/n8n-io/n8n/blob/master/docker/images/n8n/n8n/Dockerfile):

```dockerfile
RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-elevenlabs-music
```

## Operations

This node supports the following operations:

### Generate Music
Generate music from a text prompt using ElevenLabs' Music API.

**Parameters:**
- **Prompt** (required): Text description of the music you want to generate (max 2000 characters)
- **Music Length**: Duration in seconds (10-300 seconds, default: 30)
- **Output Format**: Audio format for the generated music
  - MP3 44.1kHz 128kbps (default)
  - MP3 44.1kHz 192kbps (requires Creator tier+)
  - MP3 22.05kHz 32kbps
  - PCM 44.1kHz (requires Pro tier+)

### Generate Music with Details
Generate music and return detailed metadata including composition plan and song information.

**Parameters:**
- Same as Generate Music operation
- Returns additional metadata in the response

### Create Composition Plan
Create a detailed composition plan from a prompt without generating audio. This operation doesn't consume credits but is subject to rate limiting.

**Parameters:**
- **Prompt** (required): Text description for the composition plan
- **Music Length**: Duration in seconds for the plan

## Credentials

This node uses the ElevenLabs API credentials. You need to configure the following:

### ElevenLabs API
- **API Key** (required): Your ElevenLabs API key from the dashboard
- **Base URL**: API base URL (default: https://api.elevenlabs.io)

To get your API key:
1. Sign up for an [ElevenLabs account](https://elevenlabs.io/)
2. Go to your [dashboard](https://elevenlabs.io/app/settings/api-keys)
3. Create or copy your API key
4. Note: Music API is only available to paid users

## Usage Examples

### Basic Music Generation

```json
{
  "operation": "generateMusic",
  "prompt": "Create an upbeat electronic dance track with heavy bass and energetic synths",
  "musicLengthSeconds": 30,
  "outputFormat": "mp3_44100_128"
}
```

### Advanced Music Generation with Composition Plan

```json
{
  "operation": "generateMusic",
  "additionalOptions": {
    "useCompositionPlan": true,
    "compositionPlan": {
      "positiveGlobalStyles": ["electronic", "upbeat", "energetic"],
      "negativeGlobalStyles": ["slow", "acoustic", "ambient"],
      "sections": [
        {
          "sectionName": "Intro",
          "positiveLocalStyles": ["building tension", "filtered synths"],
          "negativeLocalStyles": ["heavy bass"],
          "durationMs": 8000,
          "lines": []
        },
        {
          "sectionName": "Drop",
          "positiveLocalStyles": ["heavy bass", "energetic drums"],
          "negativeLocalStyles": ["quiet", "minimal"],
          "durationMs": 22000,
          "lines": []
        }
      ]
    }
  }
}
```

### Creating a Composition Plan

```json
{
  "operation": "createCompositionPlan",
  "planPrompt": "Create a cinematic orchestral piece with rising tension and dramatic climax",
  "planMusicLengthSeconds": 60
}
```

## Compatibility

- Minimum n8n version: 0.198.0
- Node.js version: 18.17.0 or higher

## Resources

- [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
- [ElevenLabs Music API documentation](https://elevenlabs.io/docs/api-reference/music)
- [ElevenLabs Music quickstart guide](https://elevenlabs.io/docs/cookbooks/music/quickstart)

## Version History

### 0.1.0
- Initial release
- Support for basic music generation
- Support for detailed music generation with metadata
- Support for composition plan creation
- Integration with existing ElevenLabs credentials
- Multiple output format options

## License

[MIT](https://github.com/n8n-community/n8n-nodes-elevenlabs-music/blob/master/LICENSE.md)

## Support

If you encounter any issues or have questions:

1. Check the [ElevenLabs API documentation](https://elevenlabs.io/docs/api-reference/music)
2. Review the [n8n community nodes documentation](https://docs.n8n.io/integrations/community-nodes/)
3. Open an issue on the [GitHub repository](https://github.com/n8n-community/n8n-nodes-elevenlabs-music/issues)

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Disclaimer

This is a community-maintained node and is not officially supported by n8n or ElevenLabs. Use at your own risk and ensure you comply with ElevenLabs' terms of service and API usage policies.
