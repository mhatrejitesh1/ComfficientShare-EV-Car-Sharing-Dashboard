# IAA Datentisch Frontend
This repository is a working repo to develop a modern framework for displaying geospatial data of all kinds. Mobility data are meant to be shown on the repository and this project's main development focus. One goal of the repo (which hopefully will live longer than this event) will be the IAA 2023 and the coupled DATSim data-table presentation with this event.

Current developers:
Supervisor (Responsible contact person): **David Ziegler**
Student (Bachelor's Thesis, 2023): **Romy Richter**   


## Getting started

The repository is meant to be extended easily and without a big effort. Ongoing, you'll find the required steps to bootstrap the repository for further individual development. Contributions as side branches that can be merged into the main branch are gladly seen and celebrated :).


## Steps to the full development
### Install dependencies
1. Please install on your PC Node.Js 16 and the corresponding NPM version.
2. Open the terminal and navigate inside this project's folder:  
    `cd <folder_this_project_is_in>`   
3. Install the required dependencies via the command:  
    `npm install`   
4. Congrats, you are good to go; you installed all requirements successfully.

### Launch the framework in development mode
1. Make sure that you still have a terminal open that is located in the folder of this project.
2. Run the following command in the terminal:  
    `npm run dev`
3. The project starts up and shows you the URL where you can see the current web version of the implementation, e.g.:  
    `Local:   http://127.0.0.1:5174/`
4. Navigate in your browser (preferably Chrome) to this URL.
5. You'll see the main project if everything has worked out well.

### Development of customized maps
1. Starting from the base folder of this project, you can find current map views under:  
    *src/components/Maps/*
2. Each file in this folder constitutes the relevant settings of a layer that you can display on the map. Based on the existing maps, you can develop new layers to display other data on the map. Be free to browse existing solutions to learn how to implement the new layer best. If you want to set up a new layer, create a new .vue file and name it corresponding to your needs. Also, share the new layers as a sub-branch.
3. To easily see what your new layer looks like, navigate to the URL:   
    *<local_project_url>/map/<name_of_the_layer_file_without_extension>*  
 e.g. if your layer is named *MyFancyNewLayer.vue* navigate to:  
    `http://127.0.0.1:5174/map/MyFancyNewLayer`
4. You'll see your new layer according to your settings. Look inside your browser's development console or the terminal if the website doesn't render. Usually you programmed something wrong then.
5. If you want to access local files, just drop them into:  
     *<project_root>/assets*  
   You will be able to access the data via the url:  
     *<local_project_url>/assets/\<file>*
5. Look at the [MapLibre Api](https://maplibre.org/maplibre-gl-js-docs/api/) for further information concerning implementation details.

### Development of customized panels
1. To modify or create a new panel, you'll have to look into the folder:  
    */src/components/Panels*
2. You can add your panel by adding a new HTML file to the folder and using the standard HTML language.
3. If you want to see the panel and get a preview, navigate to the URL:
 *<local_project_url>/panel/<name_of_the_panel_file_without_extension>*   
 e.g. if your  panel is named *MyFancyNewPanel.vue* navigate to:  
`http://127.0.0.1:5174/panel/MyFancyNewPanel`
4. Be free to implement new views and push them into a side-branch of this project.


## License
Open source license under MIT license conditions. Please keep developer credits in further implementations.

## Project status
Currently in development, beta version, not meant for production yet!