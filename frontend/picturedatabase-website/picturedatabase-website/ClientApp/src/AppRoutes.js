import { Upload } from "./components/Upload";
import { GalleryPage } from "./components/Gallery";
import { EditPicture } from "./components/EditPicture";
import { PictureOverview } from "./components/PictureOverview";

const AppRoutes = [
    {
        path: '/upload',
        element: <Upload />
    },
    {
        path: '/editPicture/:id',
        element: <EditPicture  />
    },
    {
        index: true,
        element: <GalleryPage />
    },
    {
        path: '/pictureOverview',
        element: <PictureOverview />
    }
];

export default AppRoutes;
