async function loadTransformers() {
    try {
        const module = await import(
            "https://cdn.jsdelivr.net/npm/@huggingface/transformers@3.0.1"
        );
        // Destructing the property pipeline from the module object 
        const { pipeline } = module;
        return pipeline;
    } catch (error) {
        console.error('Failed to load transformers.js', error);
    }

}