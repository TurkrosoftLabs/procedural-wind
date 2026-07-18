// ==========================================================
// Procedural Wind
// src/GustEngine.js
// ==========================================================

import {
    clamp,
    exponentialApproach,
    RandomWalk
} from "./Math.js";


export class GustEngine
{

    constructor(
        windField
    )
    {
        this.wind =
            windField;


        this.energy = 0;


        this.targetEnergy = 0;


        this.cooldown = 0;


        this.active = false;


        this.time = 0;


        this.background =
            new RandomWalk(
                0,
                0.25
            );


        this.microGust =
            new RandomWalk(
                0,
                0.5
            );


        this.gustStrength = 0.5;


        this.gustDuration = 8;


        this.remaining = 0;
    }



    trigger(
        strength = 1
    )
    {
        strength =
            clamp(
                strength,
                0,
                1
            );


        this.targetEnergy =
            clamp(
                this.targetEnergy +
                strength *
                this.gustStrength,
                0,
                1
            );


        this.remaining =
            this.gustDuration *
            (
                0.7 +
                Math.random()*0.6
            );


        this.active = true;


        this.wind.addGust(
            strength *
            this.gustStrength
        );
    }



    update(
        deltaTime
    )
    {
        this.time += deltaTime;


        if(this.cooldown > 0)
        {
            this.cooldown -= deltaTime;
        }


        this.energy =
            exponentialApproach(
                this.energy,
                this.targetEnergy,
                0.8,
                deltaTime
            );


        this.targetEnergy =
            exponentialApproach(
                this.targetEnergy,
                0,
                0.15,
                deltaTime
            );


        if(this.active)
        {
            this.remaining -= deltaTime;


            if(this.remaining <= 0)
            {
                this.active = false;
            }
        }


        const atmospheric =
            this.background
                .update(deltaTime);


        const micro =
            this.microGust
                .update(deltaTime);


        const naturalEnergy =
            clamp(
                atmospheric *
                0.03 +
                micro *
                0.04,
                0,
                1
            );


        this.wind.addGust(
            naturalEnergy
        );
    }



    setStrength(
        value
    )
    {
        this.gustStrength =
            clamp(
                value,
                0,
                1
            );
    }



    calm()
    {
        this.targetEnergy =
            0;


        this.energy =
            0;


        this.active =
            false;


        this.wind.calm();
    }



    getEnergy()
    {
        return this.energy;
    }



    isActive()
    {
        return this.active;
    }

}