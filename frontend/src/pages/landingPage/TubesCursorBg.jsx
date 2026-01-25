import { useEffect, useRef } from "react";

export default function TubesCursorBg() {
  const canvasRef = useRef(null);
  const appRef = useRef(null);

  useEffect(() => {
    let disposed = false;

    (async () => {
      const mod =
        await import("https://cdn.jsdelivr.net/npm/threejs-components@0.0.19/build/cursors/tubes1.min.js");

      if (disposed) return;

      const TubesCursor = mod.default;

      const app = TubesCursor(canvasRef.current, {
        tubes: {
          colors: ["#f967fb", "#53bc28", "#6958d5"],
          lights: {
            intensity: 200,
            colors: ["#83f36e", "#fe8a2e", "#ff008a", "#60aed5"],
          },
        },
      });

      appRef.current = app;
    })();

    // Cleanup
    return () => {
      disposed = true;

      const app = appRef.current;
      if (app?.dispose) app.dispose();
      else if (app?.destroy) app.destroy();

      appRef.current = null;
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
        background: "transparent",
        mixBlendMode: "screen",
        opacity: 0.8,
      }}
    />
  );
}
