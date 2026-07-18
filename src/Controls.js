// ==========================================================
// Procedural Wind
// src/Controls.js
// ==========================================================

import {
    normalizeAngle,
    vectorToAngle,
    clamp
} from "./Math.js";


export class Controls
{

    constructor(
        windField,
        gustEngine
    )
    {
        this.wind =
            windField;


        this.gusts =
            gustEngine;


        this.keys =
            new Set();


        this.running =
            false;


        this.intensityStep =
            0;


        this.directionKeys = {

            W:0,

            E:45,

            D:90,

            C:135,

            X:180,

            Z:225,

            A:270,

            Q:315

        };


        this.arrowUp =
            false;


        this.arrowDown =
            false;


        this.attach();
    }



    attach()
    {
        window.addEventListener(
            "keydown",
            e => this.keyDown(e)
        );


        window.addEventListener(
            "keyup",
            e => this.keyUp(e)
        );


        this.updateLoop();
    }



    keyDown(e)
    {
        const key =
            e.key.toUpperCase();


        if(
            e.code === "Space"
        )
        {
            e.preventDefault();

            this.togglePower();

            return;
        }


        if(
            e.code === "Enter"
        )
        {
            this.gusts.trigger(
                this.wind.getIntensity()
            );

            return;
        }


        if(
            key === "S"
        )
        {
            this.wind.calm();

            return;
        }


        if(
            e.code === "ArrowUp"
        )
        {
            this.arrowUp = true;

            return;
        }


        if(
            e.code === "ArrowDown"
        )
        {
            this.arrowDown = true;

            return;
        }


        if(
            this.directionKeys[key] !== undefined
        )
        {
            this.keys.add(key);

            this.updateDirection();
        }
    }



    keyUp(e)
    {
        const key =
            e.key.toUpperCase();


        if(
            e.code === "ArrowUp"
        )
        {
            this.arrowUp = false;

            return;
        }


        if(
            e.code === "ArrowDown"
        )
        {
            this.arrowDown = false;

            return;
        }


        this.keys.delete(key);

        this.updateDirection();
    }



    togglePower()
    {
        this.running =
            !this.running;


        if(this.running)
        {
            this.wind.start();
        }
        else
        {
            this.wind.stop();
        }
    }



    updateDirection()
    {
        if(
            this.keys.size === 0
        )
        {
            return;
        }


        let x = 0;

        let y = 0;


        for(
            const key of this.keys
        )
        {
            const angle =
                this.directionKeys[key];


            const radians =
                angle *
                Math.PI /
                180;


            x += Math.sin(radians);

            y += Math.cos(radians);
        }


        if(
            Math.abs(x) < 0.0001 &&
            Math.abs(y) < 0.0001
        )
        {
            return;
        }


        this.wind.setDirection(
            normalizeAngle(
                vectorToAngle(
                    x,
                    y
                )
            )
        );
    }



    updateLoop()
    {
        const update =
            () =>
            {

                if(this.arrowUp)
                {
                    this.wind.setIntensity(
                        this.wind.getIntensity()
                        +
                        0.005
                    );
                }


                if(this.arrowDown)
                {
                    this.wind.setIntensity(
                        this.wind.getIntensity()
                        -
                        0.005
                    );
                }


                this.wind.setIntensity(
                    clamp(
                        this.wind.getIntensity(),
                        0,
                        1
                    )
                );


                requestAnimationFrame(
                    update
                );
            };


        requestAnimationFrame(
            update
        );
    }

}