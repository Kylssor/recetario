import { useSpring, animated } from "@react-spring/web";

export default function Shell({ children }) {
  const header = useSpring({ from: { opacity: 0, y: -8 }, to: { opacity: 1, y: 0 } });
  return (
    <div className="min-h-screen bg-emerald-50 text-slate-800">
      <animated.header style={header} className="sticky top-0 bg-emerald-50/80 backdrop-blur z-10">
        <div className="max-w-6xl mx-auto px-4 py-3 flex justify-between">
          <div className="font-semibold text-emerald-800">Recetario Verde</div>
          <nav className="text-sm text-emerald-700">Saludable & económico</nav>
        </div>
      </animated.header>
      <main className="max-w-6xl mx-auto px-4 py-6">{children}</main>
    </div>
  );
}
