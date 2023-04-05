import { Upload } from "./components/Upload";
import { Home } from "./components/Home";
import { Gallery } from "./components/Gallery";
import { EditPicture } from "./components/EditPicture";

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
        path: '/editPicture/:id',
        element: <EditPicture  />
    },
    {
        path: '/gallery',
        element: <Gallery />
    }
];

export default AppRoutes;
