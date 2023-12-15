import Resizer from "react-image-file-resizer";

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

export const getCookie = (cookieName) => {
  const cookieArray = document.cookie.split("; ");
  for (let i = 0 ; i < cookieArray.length ; i++){
    const [ name , value ] = cookieArray[i].split('=')
    if(name === cookieName){
      const cookieValue = decodeURIComponent(value)
      const realValue = cookieValue.slice(2);
      return JSON.parse(realValue)
    }
  }
}

export const calculateResultHandler = (count,setCount) => {
  if(count > 999999){
    setCount((count/1000000).toFixed(1))
  }else if(count > 999){
    setCount((count/1000).toFixed(1))
  }else if (count > 0){
    setCount(count)
  }
}

export const resizeFile = (file) => new Promise((resolve) => {
  Resizer.imageFileResizer(
    file,
    600,
    600,
    "JPEG",
    100,
    0,
    (uri) => {
      resolve(uri)
    },
    "file",
    300,
    300
  );
})