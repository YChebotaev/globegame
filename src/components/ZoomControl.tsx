import { MutableRefObject } from "react";
import { PlusIcon, MinusIcon } from "@heroicons/react/outline";
import { GlobeMethods } from "react-globe.gl";

type Props = {
  globeRef: MutableRefObject<GlobeMethods>;
};

const animate = (
  from: number,
  to: number,
  step: number,
  direction: "forward" | "backward",
  callback: (value: number) => void,
) => {
  let current = from;

  const tick = () => {
    current = direction === "forward" ? (current += step) : (current -= step);

    callback(current);

    if (direction === "forward" ? current < to : current > to) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

export default function ZoomControl({ globeRef }: Props) {
  return (
    <div className="ZoomControl flex height-0 justify-between left-0 absolute right-0 top-5">
      <button
        className="dark:text-white"
        style={{
          width: 30,
          height: 30,
        }}
        onClick={() => {
          const { lat, lng, altitude } = globeRef.current.pointOfView();

          animate(altitude, altitude + 0.25, 0.01, "forward", (altitude) => {
            globeRef.current.pointOfView({
              lat,
              lng,
              altitude,
            });
          });
        }}
      >
        <MinusIcon />
      </button>
      <button
        className="dark:text-white"
        style={{
          width: 30,
          height: 30,
        }}
        onClick={() => {
          const { lat, lng, altitude } = globeRef.current.pointOfView();

          animate(altitude, altitude - 0.25, 0.01, "backward", (altitude) => {
            globeRef.current.pointOfView({
              lat,
              lng,
              altitude,
            });
          });
        }}
      >
        <PlusIcon />
      </button>
    </div>
  );
}
