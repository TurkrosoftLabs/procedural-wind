// ==========================================================
// Procedural Wind
// src/Math.js
// ==========================================================

export const EPSILON = 0.000001;


// ----------------------------------------------------------
// Basic utilities
// ----------------------------------------------------------

export function clamp(value, min, max)
{
    return Math.min(
        Math.max(value, min),
        max
    );
}


export function lerp(a, b, t)
{
    return a + (b - a) * t;
}


export function inverseLerp(a, b, value)
{
    if(a === b)
        return 0;

    return (value - a) / (b - a);
}


export function mapRange(
    value,
    inMin,
    inMax,
    outMin,
    outMax
)
{
    return lerp(
        outMin,
        outMax,
        inverseLerp(
            inMin,
            inMax,
            value
        )
    );
}


// ----------------------------------------------------------
// Smooth interpolation
// ----------------------------------------------------------

export function smoothStep(t)
{
    t = clamp(t,0,1);

    return t * t * (3 - 2 * t);
}


export function smootherStep(t)
{
    t = clamp(t,0,1);

    return t * t * t *
        (t * (t * 6 - 15) + 10);
}


export function exponentialApproach(
    current,
    target,
    sharpness,
    deltaTime
)
{
    return current +
        (target - current) *
        (1 - Math.exp(
            -sharpness * deltaTime
        ));
}


export function damp(
    current,
    target,
    smoothing,
    deltaTime
)
{
    return exponentialApproach(
        current,
        target,
        smoothing,
        deltaTime
    );
}


// ----------------------------------------------------------
// Angle utilities
// ----------------------------------------------------------

export function normalizeAngle(angle)
{
    angle %= 360;

    if(angle < 0)
        angle += 360;

    return angle;
}


export function degreesToRadians(degrees)
{
    return degrees * Math.PI / 180;
}


export function radiansToDegrees(radians)
{
    return radians * 180 / Math.PI;
}


export function shortestAngleDifference(
    from,
    to
)
{
    let difference =
        normalizeAngle(to) -
        normalizeAngle(from);

    if(difference > 180)
        difference -= 360;

    if(difference < -180)
        difference += 360;

    return difference;
}


export function angleLerp(
    current,
    target,
    amount
)
{
    return normalizeAngle(
        current +
        shortestAngleDifference(
            current,
            target
        ) *
        amount
    );
}


export function angleDistance(
    a,
    b
)
{
    return Math.abs(
        shortestAngleDifference(a,b)
    );
}


export function angleToVector(angle)
{
    const radians =
        degreesToRadians(angle);

    return {
        x: Math.sin(radians),
        y: Math.cos(radians)
    };
}


export function vectorToAngle(
    x,
    y
)
{
    return normalizeAngle(
        radiansToDegrees(
            Math.atan2(x,y)
        )
    );
}


// ----------------------------------------------------------
// Vector operations
// ----------------------------------------------------------

export function addVectors(a,b)
{
    return {
        x:a.x+b.x,
        y:a.y+b.y
    };
}


export function subtractVectors(a,b)
{
    return {
        x:a.x-b.x,
        y:a.y-b.y
    };
}


export function multiplyVector(
    vector,
    scalar
)
{
    return {
        x:vector.x*scalar,
        y:vector.y*scalar
    };
}


export function vectorLength(vector)
{
    return Math.sqrt(
        vector.x * vector.x +
        vector.y * vector.y
    );
}


export function normalizeVector(vector)
{
    const length =
        vectorLength(vector);

    if(length < EPSILON)
    {
        return {
            x:0,
            y:0
        };
    }

    return {
        x:vector.x / length,
        y:vector.y / length
    };
}


export function dotProduct(a,b)
{
    return (
        a.x*b.x +
        a.y*b.y
    );
}


// ----------------------------------------------------------
// Circular direction blending
// ----------------------------------------------------------

export function circularWeight(
    sourceAngle,
    targetAngle,
    range = 90
)
{
    const distance =
        angleDistance(
            sourceAngle,
            targetAngle
        );

    return clamp(
        1 - distance / range,
        0,
        1
    );
}


export function blendDirections(
    directions
)
{
    let x = 0;
    let y = 0;

    for(const direction of directions)
    {
        const vector =
            angleToVector(
                direction.angle
            );

        x += vector.x *
             direction.weight;

        y += vector.y *
             direction.weight;
    }

    if(
        Math.abs(x) < EPSILON &&
        Math.abs(y) < EPSILON
    )
    {
        return 0;
    }

    return vectorToAngle(
        x,
        y
    );
}


// ----------------------------------------------------------
// Random utilities
// ----------------------------------------------------------

export class Random
{

    constructor(seed = Date.now())
    {
        this.seed = seed >>> 0;
    }


    next()
    {
        this.seed =
            (1664525 * this.seed + 1013904223)
            >>> 0;

        return this.seed / 4294967296;
    }


    range(min,max)
    {
        return lerp(
            min,
            max,
            this.next()
        );
    }


    signed()
    {
        return this.next() * 2 - 1;
    }

}


// ----------------------------------------------------------
// Smooth random walk
// ----------------------------------------------------------

export class RandomWalk
{

    constructor(
        value = 0,
        speed = 1,
        random = new Random()
    )
    {
        this.value=value;
        this.target=value;
        this.speed=speed;
        this.random=random;
    }


    update(deltaTime)
    {
        if(
            Math.abs(
                this.value -
                this.target
            ) < 0.001
        )
        {
            this.target =
                this.random.signed();
        }


        this.value =
            exponentialApproach(
                this.value,
                this.target,
                this.speed,
                deltaTime
            );


        return this.value;
    }

}


// ----------------------------------------------------------
// Value noise
// ----------------------------------------------------------

function fade(t)
{
    return smootherStep(t);
}


function hash(x)
{
    x = Math.sin(x * 127.1) * 43758.5453123;

    return x - Math.floor(x);
}


export function valueNoise(x)
{
    const x0 =
        Math.floor(x);

    const x1 =
        x0 + 1;


    const t =
        fade(
            x - x0
        );


    return lerp(
        hash(x0),
        hash(x1),
        t
    ) * 2 - 1;
}


// ----------------------------------------------------------
// Fractal noise
// ----------------------------------------------------------

export function fractalNoise(
    x,
    octaves = 4,
    persistence = 0.5
)
{
    let amplitude = 1;

    let frequency = 1;

    let total = 0;

    let normalization = 0;


    for(
        let i=0;
        i<octaves;
        i++
    )
    {
        total +=
            valueNoise(
                x * frequency
            )
            *
            amplitude;


        normalization += amplitude;


        amplitude *= persistence;

        frequency *= 2;
    }


    return total / normalization;
}


// ----------------------------------------------------------
// Low frequency oscillator
// ----------------------------------------------------------

export class LFO
{

    constructor(
        frequency = 1,
        phase = 0
    )
    {
        this.frequency=frequency;
        this.phase=phase;
        this.time=0;
    }


    update(deltaTime)
    {
        this.time += deltaTime;

        return Math.sin(
            this.time *
            this.frequency *
            Math.PI *
            2
            +
            this.phase
        );
    }

}


// ----------------------------------------------------------
// Moving average
// ----------------------------------------------------------

export class SmoothValue
{

    constructor(
        initial = 0,
        smoothing = 0.1
    )
    {
        this.value=initial;
        this.target=initial;
        this.smoothing=smoothing;
    }


    update(deltaTime)
    {
        this.value =
            exponentialApproach(
                this.value,
                this.target,
                this.smoothing,
                deltaTime
            );

        return this.value;
    }


    set(value)
    {
        this.target=value;
    }

}