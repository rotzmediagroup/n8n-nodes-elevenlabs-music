import {
	IExecuteFunctions,
	INodeExecutionData,
	INodeType,
	INodeTypeDescription,
	NodeConnectionType,
	NodeOperationError,
} from 'n8n-workflow';

export class ElevenLabsMusic implements INodeType {
	description: INodeTypeDescription = {
		displayName: 'ElevenLabs Music',
		name: 'elevenLabsMusic',
		icon: { light: 'file:elevenlabs.svg', dark: 'file:elevenlabs.svg' },
		group: ['transform'],
		version: 1,
		subtitle: '={{$parameter["operation"]}}',
		description: 'Generate music using ElevenLabs Music API',
		defaults: {
			name: 'ElevenLabs Music',
		},
		inputs: [NodeConnectionType.Main],
		outputs: [NodeConnectionType.Main],
		credentials: [
			{
				name: 'elevenLabsApi',
				required: true,
			},
		],
		requestDefaults: {
			baseURL: '={{$credentials.baseUrl}}',
			headers: {
				'Content-Type': 'application/json',
			},
		},
		properties: [
			{
				displayName: 'Operation',
				name: 'operation',
				type: 'options',
				noDataExpression: true,
				options: [
					{
						name: 'Generate Music',
						value: 'generateMusic',
						description: 'Generate music from a text prompt',
						action: 'Generate music from a text prompt',
					},
					{
						name: 'Generate Music with Details',
						value: 'generateMusicDetailed',
						description: 'Generate music and return detailed metadata',
						action: 'Generate music with detailed metadata',
					},
					{
						name: 'Create Composition Plan',
						value: 'createCompositionPlan',
						description: 'Create a composition plan from a prompt',
						action: 'Create a composition plan from a prompt',
					},
				],
				default: 'generateMusic',
			},

			// Generate Music Operation
			{
				displayName: 'Prompt',
				name: 'prompt',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['generateMusic', 'generateMusicDetailed'],
					},
				},
				default: '',
				placeholder: 'Create an intense, fast-paced electronic track...',
				description: 'Text description of the music you want to generate (max 2000 characters)',
				typeOptions: {
					rows: 4,
				},
			},
			{
				displayName: 'Music Length (Seconds)',
				name: 'musicLengthSeconds',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['generateMusic', 'generateMusicDetailed'],
					},
				},
				default: 30,
				typeOptions: {
					minValue: 10,
					maxValue: 300,
				},
				description: 'Length of the music to generate in seconds (10-300)',
			},
			{
				displayName: 'Output Format',
				name: 'outputFormat',
				type: 'options',
				displayOptions: {
					show: {
						operation: ['generateMusic', 'generateMusicDetailed'],
					},
				},
				options: [
					{
						name: 'MP3 44.1kHz 128kbps',
						value: 'mp3_44100_128',
					},
					{
						name: 'MP3 44.1kHz 192kbps',
						value: 'mp3_44100_192',
					},
					{
						name: 'MP3 22.05kHz 32kbps',
						value: 'mp3_22050_32',
					},
					{
						name: 'PCM 44.1kHz',
						value: 'pcm_44100',
					},
				],
				default: 'mp3_44100_128',
				description: 'Output format for the generated audio',
			},

			// Create Composition Plan Operation
			{
				displayName: 'Prompt',
				name: 'planPrompt',
				type: 'string',
				displayOptions: {
					show: {
						operation: ['createCompositionPlan'],
					},
				},
				default: '',
				placeholder: 'Create an intense, fast-paced electronic track...',
				description: 'Text description for the composition plan (max 2000 characters)',
				typeOptions: {
					rows: 4,
				},
			},
			{
				displayName: 'Music Length (Seconds)',
				name: 'planMusicLengthSeconds',
				type: 'number',
				displayOptions: {
					show: {
						operation: ['createCompositionPlan'],
					},
				},
				default: 30,
				typeOptions: {
					minValue: 10,
					maxValue: 300,
				},
				description: 'Length of the composition plan in seconds (10-300)',
			},

			// Advanced Options
			{
				displayName: 'Additional Options',
				name: 'additionalOptions',
				type: 'collection',
				placeholder: 'Add Option',
				default: {},
				options: [
					{
						displayName: 'Model ID',
						name: 'modelId',
						type: 'options',
						options: [
							{
								name: 'Music V1',
								value: 'music_v1',
							},
						],
						default: 'music_v1',
						description: 'The model to use for generation',
					},
					{
						displayName: 'Use Composition Plan',
						name: 'useCompositionPlan',
						type: 'boolean',
						default: false,
						description: 'Whether to use a composition plan instead of a simple prompt',
					},
					{
						displayName: 'Composition Plan',
						name: 'compositionPlan',
						type: 'json',
						displayOptions: {
							show: {
								useCompositionPlan: [true],
							},
						},
						default: '{}',
						description: 'JSON composition plan object',
						typeOptions: {
							rows: 10,
						},
					},
				],
			},
		],
	};

	async execute(this: IExecuteFunctions): Promise<INodeExecutionData[][]> {
		const items = this.getInputData();
		const returnData: INodeExecutionData[] = [];

		for (let i = 0; i < items.length; i++) {
			try {
				const operation = this.getNodeParameter('operation', i) as string;

				let responseData: any;

				if (operation === 'generateMusic') {
					responseData = await generateMusic.call(this, i);
				} else if (operation === 'generateMusicDetailed') {
					responseData = await generateMusicDetailed.call(this, i);
				} else if (operation === 'createCompositionPlan') {
					responseData = await createCompositionPlan.call(this, i);
				} else {
					throw new NodeOperationError(this.getNode(), `Unknown operation: ${operation}`, {
						itemIndex: i,
					});
				}

				returnData.push({
					json: responseData,
					pairedItem: {
						item: i,
					},
				});
			} catch (error) {
				if (this.continueOnFail()) {
					returnData.push({
						json: {
							error: error.message,
						},
						pairedItem: {
							item: i,
						},
					});
					continue;
				}
				throw error;
			}
		}

		return [returnData];
	}
}

async function generateMusic(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const prompt = this.getNodeParameter('prompt', itemIndex) as string;
	const musicLengthSeconds = this.getNodeParameter('musicLengthSeconds', itemIndex) as number;
	const outputFormat = this.getNodeParameter('outputFormat', itemIndex) as string;
	const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as any;

	if (!prompt) {
		throw new NodeOperationError(this.getNode(), 'Prompt is required', { itemIndex });
	}

	const musicLengthMs = musicLengthSeconds * 1000;

	const requestBody: any = {
		prompt,
		music_length_ms: musicLengthMs,
	};

	if (additionalOptions.modelId) {
		requestBody.model_id = additionalOptions.modelId;
	}

	if (additionalOptions.useCompositionPlan && additionalOptions.compositionPlan) {
		try {
			requestBody.composition_plan = JSON.parse(additionalOptions.compositionPlan);
			delete requestBody.prompt; // Cannot use both prompt and composition_plan
		} catch (error) {
			throw new NodeOperationError(this.getNode(), 'Invalid composition plan JSON', { itemIndex });
		}
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'elevenLabsApi',
		{
			method: 'POST',
			url: `/v1/music?output_format=${outputFormat}`,
			body: requestBody,
			encoding: 'arraybuffer',
		},
	);

	// Convert audio data to base64 for JSON serialization
	const audioBase64 = Buffer.from(response as ArrayBuffer).toString('base64');

	return {
		success: true,
		audioData: audioBase64,
		outputFormat,
		prompt: requestBody.prompt || 'Generated from composition plan',
		musicLengthMs,
	};
}

async function generateMusicDetailed(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const prompt = this.getNodeParameter('prompt', itemIndex) as string;
	const musicLengthSeconds = this.getNodeParameter('musicLengthSeconds', itemIndex) as number;
	const outputFormat = this.getNodeParameter('outputFormat', itemIndex) as string;
	const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as any;

	if (!prompt) {
		throw new NodeOperationError(this.getNode(), 'Prompt is required', { itemIndex });
	}

	const musicLengthMs = musicLengthSeconds * 1000;

	const requestBody: any = {
		prompt,
		music_length_ms: musicLengthMs,
	};

	if (additionalOptions.modelId) {
		requestBody.model_id = additionalOptions.modelId;
	}

	if (additionalOptions.useCompositionPlan && additionalOptions.compositionPlan) {
		try {
			requestBody.composition_plan = JSON.parse(additionalOptions.compositionPlan);
			delete requestBody.prompt; // Cannot use both prompt and composition_plan
		} catch (error) {
			throw new NodeOperationError(this.getNode(), 'Invalid composition plan JSON', { itemIndex });
		}
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'elevenLabsApi',
		{
			method: 'POST',
			url: `/v1/music/detailed?output_format=${outputFormat}`,
			body: requestBody,
			encoding: 'arraybuffer',
		},
	);

	// For detailed response, we need to parse the multipart response
	// This is a simplified implementation - in practice, you'd need to parse the multipart boundary
	const audioBase64 = Buffer.from(response as ArrayBuffer).toString('base64');

	return {
		success: true,
		audioData: audioBase64,
		outputFormat,
		prompt: requestBody.prompt || 'Generated from composition plan',
		musicLengthMs,
		// Note: In a real implementation, you'd parse the multipart response to extract metadata
		metadata: {
			note: 'Metadata parsing not implemented in this example',
		},
	};
}

async function createCompositionPlan(this: IExecuteFunctions, itemIndex: number): Promise<any> {
	const prompt = this.getNodeParameter('planPrompt', itemIndex) as string;
	const musicLengthSeconds = this.getNodeParameter('planMusicLengthSeconds', itemIndex) as number;
	const additionalOptions = this.getNodeParameter('additionalOptions', itemIndex) as any;

	if (!prompt) {
		throw new NodeOperationError(this.getNode(), 'Prompt is required', { itemIndex });
	}

	const musicLengthMs = musicLengthSeconds * 1000;

	const requestBody: any = {
		prompt,
		music_length_ms: musicLengthMs,
	};

	if (additionalOptions.modelId) {
		requestBody.model_id = additionalOptions.modelId;
	}

	const response = await this.helpers.httpRequestWithAuthentication.call(
		this,
		'elevenLabsApi',
		{
			method: 'POST',
			url: '/v1/music/plan',
			body: requestBody,
			json: true,
		},
	);

	return {
		success: true,
		compositionPlan: response,
		prompt,
		musicLengthMs,
	};
}

