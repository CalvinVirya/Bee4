const fabElement = document.getElementById("floating-snap-btn-wrapper");
let oldPositionX,
  oldPositionY;

  const move = (e) => {
    if (!fabElement.classList.contains("fab-active")) {
      const wrapperElement = document.getElementById("main-wrapper");
      const wrapperRect = wrapperElement.getBoundingClientRect();
      const buttonSize = 50; // Button width & height
  
      let newX, newY;
      if (e.type === "touchmove") {
        newX = e.touches[0].pageX;
        newY = e.touches[0].pageY;
      } else {
        newX = e.pageX;
        newY = e.pageY;
      }
  
      // Constrain X position within the main wrapper
      newX = Math.max(wrapperRect.left + buttonSize / 2, 
                       Math.min(newX, wrapperRect.right - buttonSize / 2));
  
      // Constrain Y position within the main wrapper
      newY = Math.max(wrapperRect.top + buttonSize / 2, 
                       Math.min(newY, wrapperRect.bottom - buttonSize / 2));
  
      fabElement.style.left = `${newX}px`;
      fabElement.style.top = `${newY}px`;
    }
  };

const mouseDown = (e) => {
  console.log("mouse down ");
  oldPositionY = fabElement.style.top;
  oldPositionX = fabElement.style.left;
  if (e.type === "mousedown") {
    window.addEventListener("mousemove", move);
  } else {
    window.addEventListener("touchmove", move);
  }

  fabElement.style.transition = "none";
};

const mouseUp = (e) => {
  console.log("mouse up");
  if (e.type === "mouseup") {
    window.removeEventListener("mousemove", move);
  } else {
    window.removeEventListener("touchmove", move);
  }
  snapToSide(e);
  fabElement.style.transition = "0.3s ease-in-out left";
};

const snapToSide = (e) => {
  const wrapperElement = document.getElementById('main-wrapper');
  const windowWidth = window.innerWidth;
  let currPositionX, currPositionY;
  if (e.type === "touchend") {
    currPositionX = e.changedTouches[0].clientX;
    currPositionY = e.changedTouches[0].clientY;
  } else {
    currPositionX = e.clientX;
    currPositionY = e.clientY;
  }
  if(currPositionY < 50) {
   fabElement.style.top = 50 + "px"; 
  }
  if(currPositionY > wrapperElement.clientHeight - 50) {
    fabElement.style.top = (wrapperElement.clientHeight - 50) + "px"; 
  }
  if (currPositionX < windowWidth / 2) {
    fabElement.style.left = 50 + "px";
    fabElement.classList.remove('right');
    fabElement.classList.add('left');
  } else {
    fabElement.style.left = windowWidth - 50 + "px";
    fabElement.classList.remove('left');
    fabElement.classList.add('right');
  }
};

fabElement.addEventListener("mousedown", mouseDown);

fabElement.addEventListener("mouseup", mouseUp);

fabElement.addEventListener("touchstart", mouseDown);

fabElement.addEventListener("touchend", mouseUp);

fabElement.addEventListener("click", (e) => {
  if (
    oldPositionY === fabElement.style.top &&
    oldPositionX === fabElement.style.left
  ) {
    fabElement.classList.toggle("fab-active");
  }
});

document.querySelector(".fab-btn img").addEventListener("click", (e) => {
  e.preventDefault(); 

  // Reset button position
  fabElement.style.top = "auto"; 
  fabElement.style.left = "auto"; 
  fabElement.classList.remove("fab-active"); // Ensure it resets

  console.log("Button position reset!"); // Debugging
});
