// ==========================================================
// Procedural Wind
// src/main.js
// ==========================================================

import {
    AudioEngine
} from "./AudioEngine.js";

import {
    WindField
} from "./WindField.js";

import {
    GustEngine
} from "./GustEngine.js";

import {
    Controls
} from "./Controls.js";

import {
    TouchControls
} from "./TouchControls.js";

import {
    HUD
} from "./HUD.js";


// ----------------------------------------------------------
// Application
// ----------------------------------------------------------

class WindApplication
{

    constructor()
    {
        this.audio =
            null;


        this.wind =
            null;


        this.gusts =
            null;


        this.controls =
            null;


        this.touch =
            null;


        this.hud =
            null;


        this.lastTime =
            performance.now();


        this.running =
            true;
    }



    async initialize()
    {
        this.audio =
            new AudioEngine();


        await this.audio.initialize();


        this.wind =
            new WindField(
                this.audio
            );


        this.gusts =
            new GustEngine(
                this.wind
            );


        this.controls =
            new Controls(
                this.wind,
                this.gusts
            );


        this.touch =
            new TouchControls(
                this.wind,
                this.gusts,
                document.getElementById(
                    "interactionCanvas"
                )
            );


        this.hud =
            new HUD(
                this.wind
            );


        this.hud.start();


        this.loop();
    }



    loop()
    {
        const now =
            performance.now();


        const deltaTime =
            Math.min(
                (now - this.lastTime)
                / 1000,
                0.1
            );


        this.lastTime =
            now;


        this.wind.update(
            deltaTime
        );


        this.gusts.update(
            deltaTime
        );


        if(this.running)
        {
            requestAnimationFrame(
                () => this.loop()
            );
        }
    }

}


// ----------------------------------------------------------
// Start
// ----------------------------------------------------------

const app =
    new WindApplication();


window.windApp =
    app;


window.addEventListener(
    "load",
    async () =>
    {
        await app.initialize();
    }
);
