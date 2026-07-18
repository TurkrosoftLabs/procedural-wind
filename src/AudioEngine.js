// ==========================================================
// Procedural Wind
// src/AudioEngine.js
// ==========================================================

export class AudioEngine
{

    constructor()
    {
        this.context = null;

        this.masterGain = null;

        this.initialized = false;

        this.running = false;

        this.sources = [];

        this.sampleRate = 44100;
    }


    async initialize()
    {
        if(this.initialized)
            return;


        const AudioContext =
            window.AudioContext ||
            window.webkitAudioContext;


        this.context =
            new AudioContext();


        this.sampleRate =
            this.context.sampleRate;


        this.masterGain =
            this.context.createGain();


        this.masterGain.gain.value = 0;


        this.masterGain.connect(
            this.context.destination
        );


        this.initialized = true;
    }


    async resume()
    {
        if(
            this.context &&
            this.context.state === "suspended"
        )
        {
            await this.context.resume();
        }
    }


    start()
    {
        if(!this.initialized)
            return;


        this.resume();


        this.running = true;


        this.masterGain.gain
            .setTargetAtTime(
                1,
                this.context.currentTime,
                2
            );
    }


    stop()
    {
        if(!this.initialized)
            return;


        this.running = false;


        this.masterGain.gain
            .setTargetAtTime(
                0,
                this.context.currentTime,
                2
            );
    }


    createNoiseBuffer(
        seconds = 4
    )
    {
        const length =
            this.sampleRate *
            seconds;


        const buffer =
            this.context.createBuffer(
                1,
                length,
                this.sampleRate
            );


        const data =
            buffer.getChannelData(0);


        for(
            let i = 0;
            i < length;
            i++
        )
        {
            data[i] =
                Math.random() * 2 - 1;
        }


        return buffer;
    }


    createNoiseSource()
    {
        const source =
            this.context
                .createBufferSource();


        source.buffer =
            this.createNoiseBuffer();


        source.loop = true;


        return source;
    }


    createBand(
        type,
        frequency,
        q = 0.7
    )
    {
        const filter =
            this.context
                .createBiquadFilter();


        filter.type = type;


        filter.frequency.value =
            frequency;


        filter.Q.value =
            q;


        return filter;
    }


    createWindBus()
    {
        const input =
            this.context.createGain();


        const low =
            this.createBand(
                "lowpass",
                180
            );


        const mid =
            this.createBand(
                "bandpass",
                800,
                0.5
            );


        const high =
            this.createBand(
                "highpass",
                2500
            );


        const lowGain =
            this.context.createGain();


        const midGain =
            this.context.createGain();


        const highGain =
            this.context.createGain();


        lowGain.gain.value = 0.4;

        midGain.gain.value = 0.8;

        highGain.gain.value = 0.25;


        input.connect(low);

        input.connect(mid);

        input.connect(high);


        low.connect(lowGain);

        mid.connect(midGain);

        high.connect(highGain);


        const output =
            this.context.createGain();


        lowGain.connect(output);

        midGain.connect(output);

        highGain.connect(output);


        return {
            input,
            output,
            filters:[
                low,
                mid,
                high
            ],
            gains:[
                lowGain,
                midGain,
                highGain
            ]
        };
    }


    createSpatialChannel(
        x,
        y,
        z
    )
    {
        const bus =
            this.createWindBus();


        const panner =
            this.context.createPanner();


        panner.panningModel =
            "HRTF";


        panner.distanceModel =
            "inverse";


        panner.refDistance = 1;


        panner.maxDistance = 10;


        panner.rolloffFactor = 1;


        if(
            panner.positionX
        )
        {
            panner.positionX.value=x;
            panner.positionY.value=y;
            panner.positionZ.value=z;
        }
        else
        {
            panner.setPosition(
                x,
                y,
                z
            );
        }


        const gain =
            this.context.createGain();


        gain.gain.value = 0;


        bus.output.connect(gain);

        gain.connect(panner);

        panner.connect(
            this.masterGain
        );


        const source =
            this.createNoiseSource();


        source.connect(
            bus.input
        );


        source.start();


        const channel = {

            source,

            gain,

            bus,

            panner,

            position:{
                x,
                y,
                z
            }

        };


        this.sources.push(
            channel
        );


        return channel;
    }


    setChannelGain(
        channel,
        value,
        smoothing = 1
    )
    {
        if(!channel)
            return;


        channel.gain
            .gain
            .setTargetAtTime(
                value,
                this.context.currentTime,
                smoothing
            );
    }


    setFilterFrequency(
        channel,
        index,
        frequency,
        smoothing = 1
    )
    {
        if(!channel)
            return;


        const filter =
            channel.bus.filters[index];


        if(!filter)
            return;


        filter.frequency
            .setTargetAtTime(
                frequency,
                this.context.currentTime,
                smoothing
            );
    }


    setChannelPosition(
        channel,
        x,
        y,
        z
    )
    {
        if(!channel)
            return;


        const panner =
            channel.panner;


        if(
            panner.positionX
        )
        {
            panner.positionX.value=x;
            panner.positionY.value=y;
            panner.positionZ.value=z;
        }
        else
        {
            panner.setPosition(
                x,
                y,
                z
            );
        }
    }


    createDirectionalSources()
    {
        const radius = 1;


        const channels = [];


        for(
            let i = 0;
            i < 8;
            i++
        )
        {
            const angle =
                i * 45 *
                Math.PI / 180;


            channels.push(
                this.createSpatialChannel(
                    Math.sin(angle) * radius,
                    0,
                    -Math.cos(angle) * radius
                )
            );
        }


        return channels;
    }

}