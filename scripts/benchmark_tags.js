
function benchmark(lastTagsSize, combosWithSize, iterations) {
    const lastTags = Array.from({ length: lastTagsSize }, (_, i) => `tag${i}`);
    const combosWith = Array.from({ length: combosWithSize }, (_, i) => `tag${i}`);

    // Baseline: Array.includes
    const startArray = performance.now();
    for (let i = 0; i < iterations; i++) {
        const comboReadyTags = (combosWith ?? []).filter(tag => lastTags.includes(tag));
    }
    const endArray = performance.now();

    // Optimized: Set.has
    const startSet = performance.now();
    for (let i = 0; i < iterations; i++) {
        const lastTagsSet = new Set(lastTags);
        const comboReadyTags = (combosWith ?? []).filter(tag => lastTagsSet.has(tag));
    }
    const endSet = performance.now();

    // Optimized 2: Set created once
    const startSetOnce = performance.now();
    const lastTagsSetOnce = new Set(lastTags);
    for (let i = 0; i < iterations; i++) {
        const comboReadyTags = (combosWith ?? []).filter(tag => lastTagsSetOnce.has(tag));
    }
    const endSetOnce = performance.now();

    return {
        arrayTime: endArray - startArray,
        setInLoopTime: endSet - startSet,
        setOnceTime: endSetOnce - startSetOnce
    };
}

const results = benchmark(100, 100, 10000);
console.log('Results (Size 100, 10000 iterations):');
console.log(`Array.includes: ${results.arrayTime.toFixed(2)}ms`);
console.log(`Set.has (Set created in each iteration): ${results.setInLoopTime.toFixed(2)}ms`);
console.log(`Set.has (Set created once): ${results.setOnceTime.toFixed(2)}ms`);

const resultsSmall = benchmark(2, 2, 1000000);
console.log('\nResults (Size 2, 1,000,000 iterations):');
console.log(`Array.includes: ${resultsSmall.arrayTime.toFixed(2)}ms`);
console.log(`Set.has (Set created in each iteration): ${resultsSmall.setInLoopTime.toFixed(2)}ms`);
console.log(`Set.has (Set created once): ${resultsSmall.setOnceTime.toFixed(2)}ms`);
