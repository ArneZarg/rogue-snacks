const { Rive, Layout, Fit, Alignment } = rive;

gsap.registerPlugin(ScrollTrigger);

const canvas = document.getElementById("riveCanvas");

let riveInstance;

/* Fix blurry canvas */
function resizeCanvas() {

const dpr = window.devicePixelRatio || 1;

const rect = canvas.getBoundingClientRect();

canvas.width = rect.width * dpr;
canvas.height = rect.height * dpr;

canvas.style.width = rect.width + "px";
canvas.style.height = rect.height + "px";

if(riveInstance){
riveInstance.resizeDrawingSurfaceToCanvas();
}

}

riveInstance = new Rive({

src: "chipanimation.riv",

canvas: canvas,

autoplay: true,

artboard: "Artboard 2",

stateMachines: "State Machine 1",

layout: new Layout({
fit: Fit.Contain,
alignment: Alignment.Center
}),

onLoad: () => {

resizeCanvas();

window.addEventListener("resize", resizeCanvas);

const inputs = riveInstance.stateMachineInputs("State Machine 1");

const numberInput = inputs.find(input => input.name === "Number 1");

if(!numberInput){
console.error("Number input not found");
return;
}

ScrollTrigger.create({

trigger: ".scene",

start: "top top",

end: "+=2500",

pin: true,

scrub: true,

onUpdate: (self) => {

const value = Math.round(self.progress * 100);

numberInput.value = value;

}

});

}

});