// ==========================================================
// Procedural Wind
// src/WindField.js
// ==========================================================

import {
    clamp,
    angleLerp,
    circularWeight,
    normalizeAngle,
    angleToVector,
    vectorToAngle,
    exponentialApproach
} from "./Math.js";

import {
    WindSource
} from "./WindSource.js";


export class WindField
{

    constructor(
        audioEngine
    )
    {
        this.audio =
            audioEngine;


        this.sources = [];


        this.running = false;


        this.direction = 0;

        this.targetDirection = 0;


        this.intensity = 0.05;

        this.targetIntensity = 0.05;


        this.speed = 0.05;

        this.targetSpeed = 0.05;


        this.turbulence = 0.15;

        this.pressure = 0.1;

        this.flutter = 0.03;


        this.gustEnergy = 0;


        this.time = 0;


        this.initializeSources();
    }



    initializeSources()
    {
        const channels =
            this.audio
                .createDirectionalSources();


        for(
            let i = 0;
            i < 8;
            i++
        )
        {
            this.sources.push(
                new WindSource(
                    this.audio,
                    channels[i],
                    i * 45
                )
            );
        }
    }



    start()
    {
        this.running = true;

        this.audio.start();
    }



    stop()
    {
        this.running = false;

        this.audio.stop();
    }



    setDirection(angle)
    {
        this.targetDirection =
            normalizeAngle(angle);
    }



    setIntensity(value)
    {
        this.targetIntensity =
            clamp(
                value,
                0,
                1
            );
    }



    increaseIntensity(amount)
    {
        this.setIntensity(
            this.targetIntensity + amount
        );
    }



    getDirection()
    {
        return this.direction;
    }



    getIntensity()
    {
        return this.intensity;
    }



    addGust(amount)
    {
        this.gustEnergy =
            clamp(
                this.gustEnergy + amount,
                0,
                1
            );


        const weights =
            this.calculateWeights();


        for(
            let i = 0;
            i < this.sources.length;
            i++
        )
        {
            this.sources[i]
                .addGust(
                    amount *
                    weights[i]
                );
        }
    }



    calculateWeights()
    {
        const weights = [];

        let total = 0;


        for(
            const source of this.sources
        )
        {
            const weight =
                circularWeight(
                    source.angle,
                    this.direction,
                    90
                );


            weights.push(weight);

            total += weight;
        }


        if(total <= 0)
        {
            return weights.map(
                () => 0
            );
        }


        return weights.map(
            value =>
                value / total
        );
    }



    update(
        deltaTime
    )
    {
        this.time += deltaTime;


        this.direction =
            angleLerp(
                this.direction,
                this.targetDirection,
                deltaTime * 1.5
            );


        this.intensity =
            exponentialApproach(
                this.intensity,
                this.targetIntensity,
                1.2,
                deltaTime
            );


        this.speed =
            exponentialApproach(
                this.speed,
                this.targetSpeed,
                1.2,
                deltaTime
            );


        const weights =
            this.calculateWeights();


        for(
            let i = 0;
            i < this.sources.length;
            i++
        )
        {
            const source =
                this.sources[i];


            source.setIntensity(
                0.02 +
                weights[i] *
                this.intensity
            );


            source.update(
                deltaTime,
                this.speed
            );
        }


        this.gustEnergy =
            exponentialApproach(
                this.gustEnergy,
                0,
                0.15,
                deltaTime
            );
    }



    calm()
    {
        this.targetIntensity =
            0.02;


        this.targetSpeed =
            0.02;


        this.gustEnergy =
            0;


        for(
            const source of this.sources
        )
        {
            source.calm();
        }
    }



    getState()
    {
        return {

            direction:
                this.direction,

            intensity:
                this.intensity,

            speed:
                this.speed,

            turbulence:
                this.turbulence,

            pressure:
                this.pressure,

            flutter:
                this.flutter,

            gustEnergy:
                this.gustEnergy

        };
    }



    directionVector()
    {
        return angleToVector(
            this.direction
        );
    }



    directionName()
    {
        const names = [

            "Front",

            "Front Right",

            "Right",

            "Back Right",

            "Back",

            "Back Left",

            "Left",

            "Front Left"

        ];


        const index =
            Math.round(
                this.direction / 45
            )
            % 8;


        return names[index];
    }

}