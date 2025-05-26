import InformationTheory from './components/InformationTheory';
import { symbolDistribution } from './utils/compression';

const App = () => {
  return (
    <div
      className="w-full bg-gray-50"
      onClick={() => console.log(symbolDistribution)}
    >
      <div className="mx-auto w-full max-w-screen-lg ">
        <InformationTheory />
      </div>
    </div>
  );
};

export default App;
