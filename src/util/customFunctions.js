export const setCountOfSlidersHandler = (count) => {
    switch (count) {
      case 1:
        return 1;
      case 2:
        if(window.innerWidth < 315){
            return 1;
        }else{
            return 2;
        }
      case 3:
        if(window.innerWidth > 720){
          return 3;
        }else if (window.innerWidth > 315) {
          return 2;
        }else {
          return 1;
        }
      default:
        if(window.innerWidth > 1000){
            return 4;
        }else if (window.innerWidth > 720){
            return 3;
        }else if (window.innerWidth > 315){
            return 2;
        }else{
            return 1;
        }
    }
}