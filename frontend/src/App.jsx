import DrawingBoard from "./components/drawingBoard";

function App() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <h1 className="text-4xl font-bold text-white">
        <DrawingBoard/>
        Tailwind is working!
      </h1>
    </div>
  );
}

export default App;