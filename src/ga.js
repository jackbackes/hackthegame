var GeneticAlgorithm = function () {};

GeneticAlgorithm.prototype.generate = function (length) {
    var str = '';
    while (str.length < length) {
        str += Math.round(Math.random());
    }
    return str;
};

GeneticAlgorithm.prototype.select = function (population, fitnesses) {
    const sum = fitnesses.reduce(function (a, b) {
        return a + b;
    });
    let cumulative = 0
    var selector = Math.random();
    var probs = fitnesses.map(function (f) {
        cumulative += f / sum;
        return cumulative;
    })

    for (let i = 0; i < probs.length; i++) {
        if (probs[i] >= selector) return population[i];
    }
};

GeneticAlgorithm.prototype.mutate = function (chromosome, p) {
    //console.log(chromosome);
    return chromosome
        .split('')
        .map(function (bit) {
            bit = +bit;
            return (Math.random() <= p) ? ((bit & 0) | (!bit & 1)) : bit;
        })
        .join('');
};

GeneticAlgorithm.prototype.crossover = function (chromosome1, chromosome2) {
    //console.log('cross', chromosome1, chromosome2);
    let index = Math.round(Math.random() * chromosome1.length);
    return [
        chromosome1.slice(0, index) + chromosome2.slice(index),
        chromosome2.slice(0, index) + chromosome1.slice(index)
    ];
};

GeneticAlgorithm.prototype.run = function (fitness, length, p_c, p_m, iterations) {
    const popSize = 100;
    iterations = iterations || 100;
    let population = Array.apply(null, Array(popSize)).map(function (_) {
        return this.generate(length);
    }.bind(this));

    for (let i = 0; i < iterations; i++) {
        let fitnesses = population.map(fitness);
        let newPop = [];
        while (newPop.length < popSize) {
            let selectedPair = [this.select(population, fitnesses), this.select(population, fitnesses)];

            let mutatedPair = [this.mutate(selectedPair[0], p_m), this.mutate(selectedPair[1], p_m)];
            if (Math.random() <= p_c) {
                let crossedPair = this.crossover(mutatedPair[0], mutatedPair[1])
                mutatedPair = crossedPair;
            }
            newPop = newPop.concat(mutatedPair);
        }
        population = newPop;
    }
    return population[population.map(fitness).indexOf(1)];
};
