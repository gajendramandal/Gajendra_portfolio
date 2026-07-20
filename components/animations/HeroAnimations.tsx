'use client';

import NeuralNetwork from './NeuralNetwork';
import TypeWriter from './TypeWriter';

export function HeroBackground() {
  return (
    <div className="absolute inset-0 overflow-hidden rounded-2xl">
      <NeuralNetwork />
    </div>
  );
}

export function AnimatedRoles() {
  return (
    <TypeWriter
      words={[
        'Computer Vision',
        'Deep Learning',
        'NLP & Transformers',
        'IoT Systems',
        'Thermal Imaging',
        'YOLO Detection',
      ]}
      className="gradient-text font-semibold"
    />
  );
}
