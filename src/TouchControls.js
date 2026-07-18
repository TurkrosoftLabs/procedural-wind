// ==========================================================
// Procedural Wind
// src/TouchControls.js
// ==========================================================

import {
    clamp,
    normalizeAngle,
    vectorToAngle
} from "./Math.js";


export class TouchControls
{

    constructor(
        windField,
        gustEngine,
        canvas
    )
    {
        this.wind =
            windField;


        this.gusts =
            gustEngine;


        this.canvas =
            canvas;


        this.active =
            false;


        this.pointerId =
            null;


        this.center = {
            x:0,
            y:0
        };


        this.radius = 0;


        this.lastPosition = {
            x:0,
            y:0
        };


        this.initialize();

    }



    initialize()
    {
        this.resize();


        window.addEventListener(
            "resize",
            () => this.resize()
        );


        this.canvas.addEventListener(
            "pointerdown",
            e => this.pointerDown(e)
        );


        this.canvas.addEventListener(
            "pointermove",
            e => this.pointerMove(e)
        );


        this.canvas.addEventListener(
            "pointerup",
            e => this.pointerUp(e)
        );


        this.canvas.addEventListener(
            "pointercancel",
            e => this.pointerUp(e)
        );
    }



    resize()
    {
        this.canvas.width =
            window.innerWidth *
            devicePixelRatio;


        this.canvas.height =
            window.innerHeight *
            devicePixelRatio;


        this.canvas.style.width =
            window.innerWidth + "px";


        this.canvas.style.height =
            window.innerHeight + "px";


        const width =
            window.innerWidth;


        const height =
            window.innerHeight;


        this.center.x =
            width / 2;


        this.center.y =
            height / 2;


        this.radius =
            Math.min(
                width,
                height
            ) / 2;
    }



    pointerDown(e)
    {
        this.active = true;

        this.pointerId =
            e.pointerId;


        this.canvas.setPointerCapture(
            e.pointerId
        );


        this.updatePosition(
            e.clientX,
            e.clientY
        );


        this.gusts.trigger(
            this.wind.getIntensity()
        );
    }



    pointerMove(e)
    {
        if(!this.active)
            return;


        if(
            e.pointerId !==
            this.pointerId
        )
            return;


        this.updatePosition(
            e.clientX,
            e.clientY
        );
    }



    pointerUp(e)
    {
        if(
            e.pointerId !==
            this.pointerId
        )
            return;


        this.active = false;

        this.pointerId = null;
    }



    updatePosition(
        x,
        y
    )
    {
        this.lastPosition.x = x;

        this.lastPosition.y = y;


        const dx =
            x -
            this.center.x;


        const dy =
            this.center.y -
            y;


        const distance =
            Math.sqrt(
                dx * dx +
                dy * dy
            );


        const strength =
            clamp(
                distance /
                this.radius,
                0,
                1
            );


        const angle =
            normalizeAngle(
                vectorToAngle(
                    dx,
                    dy
                )
            );


        this.wind.setDirection(
            angle
        );


        this.wind.setIntensity(
            0.02 +
            strength *
            0.98
        );
    }



    getPosition()
    {
        return {

            x:
                this.lastPosition.x,

            y:
                this.lastPosition.y

        };
    }



    getRadius()
    {
        return this.radius;
    }



    getCenter()
    {
        return this.center;
    }

}