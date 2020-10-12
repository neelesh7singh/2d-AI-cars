// let c = 0;

// function nextGeneration() {
//   //   console.log(deadBirds.length);
//   let sum = 0;
//   deadBirds.forEach((bird) => {
//     sum += bird.score;
//   });
//   deadBirds.forEach((bird) => {
//     bird.fitness = bird.score / sum;
//   });
//   c = 0;
//   for (let i = 0; i < TOTAL; i++) {
//     birds.push(pickOne(sum));
//   }

//   console.log(c);
// pipes = [];
// pipes.push(new Pipe());
// count = 1;
// deadBirds = [];
//   // console.log(score);
//   console.log('new generation');
// score = 0;
// gen++;
// }

// function pickOne(sum) {
//   let index = 0;
//   let r = random(sum);
//   while (r > 0) {
//     r = r - deadBirds[index].score;
//     index++;
//   }
//   index--;
//   let child = deadBirds[index];
//   let newChild = new Bird();
//   newChild.brain = child.brain.copy();
//   if (Math.random() < 0.1) if (newChild.brain.mutate(0.1)) c++;
//   return newChild;
// }
function nextGeneration() {
  console.log('next generation');
  calculateFitness(end);
  for (let i = 0; i < TOTAL; i++) {
    population[i] = pickOne();
  }
  for (let i = 0; i < TOTAL; i++) {
    savedParticles[i].dispose();
  }
  savedParticles = [];
}

function pickOne() {
  let index = 0;
  let r = random(1);
  while (r > 0) {
    r = r - savedParticles[index].fitness;
    index++;
  }
  index--;
  let particle = savedParticles[index];
  let child = new Particle(particle.brain);
  child.mutate();
  return child;
}

function calculateFitness() {
  for (let particle of savedParticles) {
    particle.calculateFitness();
  }

  let sum = 0;
  for (let particle of savedParticles) {
    sum += particle.fitness;
  }
  for (let particle of savedParticles) {
    particle.fitness = particle.fitness / sum;
  }
}