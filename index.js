const typewriter = (el, text, finishCallback) => {

    const typeSpeeds = [100, 150, 250, 400, 500];

    const typePace = new rxjs.Observable(function obs(subscriber) {
        const randomNum = Math.floor(Math.random() * typeSpeeds.length);
        const randomSpeed = typeSpeeds[randomNum];
        setTimeout(() => {
            subscriber.next();
            obs(subscriber);
        }, randomSpeed);
    });

    const removePace = new rxjs.Observable(function obs(subscriber) {
        setTimeout(() => {
            subscriber.next();
            obs(subscriber);
        }, 100);
    });

    const textBuilder = new rxjs.Observable(subscriber => {
        // const text = textList[0];
        let charAt = 1;
        const sub = typePace.subscribe(() => {
            subscriber.next(text.substring(0, charAt));
            if (charAt === text.length) {
                subscriber.complete();
                sub.unsubscribe();
            }
            charAt += 1;
        });
    });

    const textRemover = new rxjs.Observable(subscriber => {
        // const text = textList[0];
        let charAt = text.length;
        const sub = removePace.subscribe(() => {
            subscriber.next(text.substring(0, charAt));
            if (charAt === 0) {
                subscriber.complete();
                sub.unsubscribe();
            }
            charAt -= 1;
        });
    });

    const waitUntilRemoveMS = 2000;
    const waitUntilLoopMS = 1000;

    const typewriterLoop = () => {
        textBuilder.subscribe({
            next: text => {
                el.textContent = text;
            },
            complete: () => {
                setTimeout(() => {
                    textRemover.subscribe({
                        next: text => {
                            el.textContent = text;
                        },
                        complete: () => {
                            setTimeout(() => {
                                // typewriterLoop();
                                finishCallback();
                            }, waitUntilLoopMS);
                        }
                    });
                }, waitUntilRemoveMS);
            }
        });
    };

    typewriterLoop();
};

const textList = [
    'Hello World!',
    'Hola Mundo!',
    'Hallo Welt!'
];

const typewriterElements = document.getElementsByClassName('typewriter');
const typewriterEl = typewriterElements[0];

let index = 0;
const loop = () => {
    typewriter(typewriterEl, textList[index], () => {
        index += 1;
        if (index >= textList.length) {
            index = 0;
        }
        loop();
    });
}

loop();
