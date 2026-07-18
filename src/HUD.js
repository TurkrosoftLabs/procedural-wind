// ==========================================================
// Procedural Wind
// src/HUD.js
// ==========================================================

export class HUD
{

    constructor(
        windField
    )
    {
        this.wind =
            windField;


        this.elements = {

            state:
                document.getElementById(
                    "engineState"
                ),

            direction:
                document.getElementById(
                    "directionValue"
                ),

            angle:
                document.getElementById(
                    "angleValue"
                ),

            intensity:
                document.getElementById(
                    "intensityValue"
                ),

            speed:
                document.getElementById(
                    "speedValue"
                ),

            gust:
                document.getElementById(
                    "gustValue"
                ),

            turbulence:
                document.getElementById(
                    "turbulenceValue"
                ),

            flutter:
                document.getElementById(
                    "flutterValue"
                ),

            pressure:
                document.getElementById(
                    "pressureValue"
                ),

            atmosphere:
                document.getElementById(
                    "atmosphereValue"
                )

        };


        this.canvas =
            document.getElementById(
                "interactionCanvas"
            );


        this.context =
            this.canvas.getContext(
                "2d"
            );


        this.running =
            false;


        this.frame =
            null;


        this.lastState =
            null;
    }



    start()
    {
        if(this.running)
            return;


        this.running = true;

        this.draw();
    }



    stop()
    {
        this.running = false;


        if(this.frame)
        {
            cancelAnimationFrame(
                this.frame
            );
        }
    }



    draw()
    {
        if(!this.running)
            return;


        this.update();


        this.drawInteractionCircle();


        this.frame =
            requestAnimationFrame(
                () => this.draw()
            );
    }



    update()
    {
        const state =
            this.wind.getState();


        this.lastState =
            state;


        if(this.elements.state)
        {
            const active =
                state.intensity >
                0.03;


            this.elements.state.textContent =
                active
                ? "RUNNING"
                : "CALM";


            this.elements.state.className =
                active
                ? "running"
                : "stopped";
        }


        if(this.elements.direction)
        {
            this.elements.direction.textContent =
                this.wind.directionName();
        }


        if(this.elements.angle)
        {
            this.elements.angle.textContent =
                Math.round(
                    state.direction
                ) + "°";
        }


        if(this.elements.intensity)
        {
            this.elements.intensity.textContent =
                state.intensity
                    .toFixed(2);
        }


        if(this.elements.speed)
        {
            this.elements.speed.textContent =
                state.speed
                    .toFixed(2);
        }


        if(this.elements.gust)
        {
            this.elements.gust.textContent =
                state.gustEnergy
                    .toFixed(2);
        }


        if(this.elements.turbulence)
        {
            this.elements.turbulence.textContent =
                state.turbulence
                    .toFixed(2);
        }


        if(this.elements.flutter)
        {
            this.elements.flutter.textContent =
                state.flutter
                    .toFixed(2);
        }


        if(this.elements.pressure)
        {
            this.elements.pressure.textContent =
                state.pressure
                    .toFixed(2);
        }


        if(this.elements.atmosphere)
        {
            this.elements.atmosphere.textContent =
                state.speed
                    .toFixed(2);
        }
    }



    drawInteractionCircle()
    {
        const ctx =
            this.context;


        const width =
            window.innerWidth *
            devicePixelRatio;


        const height =
            window.innerHeight *
            devicePixelRatio;


        ctx.clearRect(
            0,
            0,
            width,
            height
        );


        const radius =
            Math.min(
                window.innerWidth,
                window.innerHeight
            ) / 2;


        const cx =
            width / 2;


        const cy =
            height / 2;


        ctx.save();


        ctx.scale(
            devicePixelRatio,
            devicePixelRatio
        );


        ctx.beginPath();


        ctx.arc(
            window.innerWidth / 2,
            window.innerHeight / 2,
            radius,
            0,
            Math.PI * 2
        );


        ctx.strokeStyle =
            "rgba(114,214,255,0.08)";


        ctx.lineWidth =
            2;


        ctx.stroke();


        const state =
            this.lastState;


        if(state)
        {
            const angle =
                state.direction *
                Math.PI /
                180;


            const length =
                radius *
                state.intensity;


            const x =
                Math.sin(angle) *
                length;


            const y =
                -Math.cos(angle) *
                length;


            ctx.beginPath();


            ctx.moveTo(
                window.innerWidth/2,
                window.innerHeight/2
            );


            ctx.lineTo(
                window.innerWidth/2 + x,
                window.innerHeight/2 + y
            );


            ctx.strokeStyle =
                "rgba(114,214,255,0.35)";


            ctx.lineWidth =
                3;


            ctx.stroke();
        }


        ctx.restore();
    }

}