// ==========================================================
// Procedural Wind
// src/WindSource.js
// ==========================================================

import {
    clamp,
    exponentialApproach,
    fractalNoise,
    LFO,
    RandomWalk
} from "./Math.js";


export class WindSource
{

    constructor(
        audioEngine,
        channel,
        angle
    )
    {
        this.audio =
            audioEngine;

        this.channel =
            channel;

        this.angle =
            angle;


        this.active = true;


        this.targetIntensity = 0.02;

        this.intensity = 0.02;


        this.gustEnergy = 0;


        this.turbulence = 0.15;

        this.flutter = 0.03;


        this.time = 0;


        this.turbulenceNoise =
            new RandomWalk(
                0,
                0.8
            );


        this.filterNoise =
            new RandomWalk(
                0,
                0.4
            );


        this.flutterOsc =
            new LFO(
                8,
                Math.random()*Math.PI*2
            );


        this.lowFrequency =
            180;

        this.midFrequency =
            800;

        this.highFrequency =
            3000;


        this.updateAudio();
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



    addGust(amount)
    {
        this.gustEnergy =
            clamp(
                this.gustEnergy + amount,
                0,
                1
            );
    }



    setAngle(angle)
    {
        this.angle = angle;
    }



    update(
        deltaTime,
        globalIntensity
    )
    {
        this.time += deltaTime;


        const turbulence =
            this.turbulenceNoise
                .update(deltaTime);


        const flutter =
            this.flutterOsc
                .update(deltaTime);


        const spectralMovement =
            this.filterNoise
                .update(deltaTime);


        this.gustEnergy =
            exponentialApproach(
                this.gustEnergy,
                0,
                0.18,
                deltaTime
            );


        const naturalVariation =
            1 +
            turbulence *
            this.turbulence;


        const flutterAmount =
            1 +
            flutter *
            this.flutter;


        const finalIntensity =
            (
                this.intensity *
                globalIntensity
                +
                this.gustEnergy
            )
            *
            naturalVariation
            *
            flutterAmount;


        this.intensity =
            exponentialApproach(
                this.intensity,
                this.targetIntensity,
                1.5,
                deltaTime
            );


        this.audio.setChannelGain(
            this.channel,
            clamp(
                finalIntensity,
                0,
                1
            ),
            0.5
        );


        this.updateFilters(
            spectralMovement
        );
    }



    updateFilters(
        movement
    )
    {
        const low =
            160 +
            movement * 60;


        const mid =
            700 +
            movement * 250;


        const high =
            2800 +
            movement * 900;


        this.audio.setFilterFrequency(
            this.channel,
            0,
            low,
            1.5
        );


        this.audio.setFilterFrequency(
            this.channel,
            1,
            mid,
            1.5
        );


        this.audio.setFilterFrequency(
            this.channel,
            2,
            high,
            1.5
        );
    }



    updateAudio()
    {
        this.audio.setChannelGain(
            this.channel,
            0,
            0.5
        );
    }



    calm()
    {
        this.targetIntensity =
            0.02;

        this.gustEnergy =
            0;
    }



    reset()
    {
        this.targetIntensity =
            0.02;

        this.intensity =
            0.02;

        this.gustEnergy =
            0;
    }

}