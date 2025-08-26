# Installation Guide for n8n-nodes-elevenlabs-music

This guide provides detailed instructions for installing and setting up the ElevenLabs Music node in your n8n environment.

## Prerequisites

Before installing this node, ensure you have:

1. **n8n Installation**: A working n8n instance (version 0.198.0 or higher)
2. **ElevenLabs Account**: A paid ElevenLabs account with Music API access
3. **API Key**: Your ElevenLabs API key from the dashboard

## Installation Methods

### Method 1: Community Nodes (Recommended)

This is the easiest method for n8n Cloud and self-hosted instances with community nodes enabled.

1. **Access Community Nodes Settings**
   - In n8n, go to **Settings** → **Community Nodes**
   - Click **Install**

2. **Install the Package**
   - Enter `n8n-nodes-elevenlabs-music` in the package name field
   - Read and accept the community node risks
   - Click **Install**

3. **Verify Installation**
   - The node should appear in your node palette
   - Search for "ElevenLabs" in the node search

### Method 2: Manual Installation (Self-hosted)

For self-hosted n8n instances where you have direct access to the server.

1. **Navigate to n8n Directory**
   ```bash
   cd /path/to/your/n8n/installation
   ```

2. **Install the Package**
   ```bash
   npm install n8n-nodes-elevenlabs-music
   ```

3. **Restart n8n**
   ```bash
   # If using systemd
   sudo systemctl restart n8n
   
   # If running directly
   n8n start
   ```

### Method 3: Docker Installation

For Docker-based n8n deployments.

1. **Create Custom Dockerfile**
   ```dockerfile
   FROM n8nio/n8n:latest
   
   USER root
   RUN cd /usr/local/lib/node_modules/n8n && npm install n8n-nodes-elevenlabs-music
   USER node
   ```

2. **Build Custom Image**
   ```bash
   docker build -t n8n-with-elevenlabs .
   ```

3. **Run Container**
   ```bash
   docker run -it --rm \
     --name n8n \
     -p 5678:5678 \
     -v ~/.n8n:/home/node/.n8n \
     n8n-with-elevenlabs
   ```

### Method 4: Docker Compose

For Docker Compose deployments.

1. **Update docker-compose.yml**
   ```yaml
   version: '3.8'
   services:
     n8n:
       image: n8nio/n8n:latest
       ports:
         - "5678:5678"
       environment:
         - N8N_BASIC_AUTH_ACTIVE=true
         - N8N_BASIC_AUTH_USER=admin
         - N8N_BASIC_AUTH_PASSWORD=password
       volumes:
         - ~/.n8n:/home/node/.n8n
       command: >
         sh -c "cd /usr/local/lib/node_modules/n8n && 
                npm install n8n-nodes-elevenlabs-music && 
                n8n start"
   ```

2. **Start Services**
   ```bash
   docker-compose up -d
   ```

## Setting Up Credentials

After installation, you need to configure your ElevenLabs API credentials.

### 1. Create ElevenLabs Credentials

1. **Access Credentials**
   - In n8n, go to **Settings** → **Credentials**
   - Click **Add Credential**
   - Search for "ElevenLabs API"

2. **Configure Credentials**
   - **Name**: Give your credential a descriptive name (e.g., "ElevenLabs Music API")
   - **API Key**: Enter your ElevenLabs API key
   - **Base URL**: Leave as default (`https://api.elevenlabs.io`)

3. **Test Credentials**
   - Click **Test** to verify your credentials work
   - Save the credentials

### 2. Get Your ElevenLabs API Key

1. **Sign Up/Login**
   - Go to [ElevenLabs](https://elevenlabs.io/)
   - Sign up for an account or log in

2. **Upgrade to Paid Plan**
   - Music API requires a paid subscription
   - Choose a plan that includes Music API access

3. **Get API Key**
   - Go to your [API Keys page](https://elevenlabs.io/app/settings/api-keys)
   - Create a new API key or copy an existing one
   - Keep this key secure

## Verification

### 1. Check Node Availability

1. **Create New Workflow**
   - Start a new workflow in n8n
   - Click the **+** button to add a node

2. **Search for ElevenLabs**
   - Type "ElevenLabs" in the search box
   - You should see "ElevenLabs Music" in the results

3. **Add the Node**
   - Click on "ElevenLabs Music" to add it to your workflow

### 2. Test Basic Functionality

1. **Create Test Workflow**
   ```
   Manual Trigger → ElevenLabs Music
   ```

2. **Configure ElevenLabs Music Node**
   - **Operation**: Generate Music
   - **Credentials**: Select your ElevenLabs credentials
   - **Prompt**: "Simple piano melody"
   - **Music Length**: 10 seconds

3. **Execute Workflow**
   - Click **Execute Workflow**
   - Check for successful execution and audio output

## Troubleshooting

### Common Installation Issues

#### 1. Node Not Appearing
**Problem**: ElevenLabs Music node doesn't appear in the node palette.

**Solutions**:
- Restart n8n completely
- Check if community nodes are enabled
- Verify the package was installed correctly
- Check n8n logs for errors

#### 2. Permission Errors
**Problem**: Permission denied during installation.

**Solutions**:
```bash
# For npm installations
sudo npm install n8n-nodes-elevenlabs-music

# For Docker, ensure proper user permissions
docker run --user root ...
```

#### 3. Version Compatibility
**Problem**: Node doesn't work with your n8n version.

**Solutions**:
- Update n8n to version 0.198.0 or higher
- Check compatibility requirements
- Use the latest version of the node

### Common Configuration Issues

#### 1. Credential Test Fails
**Problem**: ElevenLabs API credentials fail to authenticate.

**Solutions**:
- Verify API key is correct
- Ensure you have a paid ElevenLabs account
- Check API key permissions
- Verify base URL is correct

#### 2. Music Generation Fails
**Problem**: Music generation returns errors.

**Solutions**:
- Check your ElevenLabs account has Music API access
- Verify you have sufficient credits
- Try shorter music lengths (10-15 seconds)
- Check prompt length (max 2000 characters)

#### 3. Timeout Issues
**Problem**: Requests timeout during music generation.

**Solutions**:
- Increase n8n timeout settings
- Use shorter music durations
- Check network connectivity
- Try during off-peak hours

### Getting Help

If you encounter issues not covered here:

1. **Check Documentation**
   - Review the main README.md
   - Check the EXAMPLES.md for usage patterns

2. **Community Support**
   - Visit the [n8n Community Forum](https://community.n8n.io/)
   - Search for existing solutions
   - Post your issue with detailed information

3. **GitHub Issues**
   - Check the [GitHub repository](https://github.com/n8n-community/n8n-nodes-elevenlabs-music/issues)
   - Report bugs or request features

4. **ElevenLabs Support**
   - For API-specific issues, contact [ElevenLabs Support](https://elevenlabs.io/support)

## Next Steps

After successful installation:

1. **Explore Examples**
   - Review the EXAMPLES.md file for workflow ideas
   - Try different music generation prompts

2. **Build Workflows**
   - Create workflows that integrate music generation
   - Combine with other n8n nodes for automation

3. **Monitor Usage**
   - Keep track of your ElevenLabs API usage
   - Monitor costs and credit consumption

4. **Stay Updated**
   - Watch for node updates
   - Follow best practices for community nodes

## Uninstallation

If you need to remove the node:

### Community Nodes
1. Go to **Settings** → **Community Nodes**
2. Find "n8n-nodes-elevenlabs-music"
3. Click **Uninstall**

### Manual Installation
```bash
npm uninstall n8n-nodes-elevenlabs-music
```

### Docker
Rebuild your Docker image without the package installation step.

