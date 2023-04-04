import { Upload } from "./components/Upload";
import { Home } from "./components/Home";
import { Gallery } from "./components/Gallery";

const AppRoutes = [
    {
        index: true,
        element: <Home />
    },
    {
        path: '/upload',
        element: <Upload />
    },
    {
        path: '/gallery',
        element: <Gallery />
    }
];

export default AppRoutes;
