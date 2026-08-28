// web-vitals v3 renamed every getX() reporter to onX() and replaced FID with
// INP, so this is the current metric set.
const reportWebVitals = (onPerfEntry) => {
  if (onPerfEntry instanceof Function) {
    import("web-vitals").then(({ onCLS, onINP, onFCP, onLCP, onTTFB }) => {
      onCLS(onPerfEntry);
      onINP(onPerfEntry);
      onFCP(onPerfEntry);
      onLCP(onPerfEntry);
      onTTFB(onPerfEntry);
    });
  }
};

export default reportWebVitals;
