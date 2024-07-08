<template>
  <div class="my-map" ref="mapContainer"></div>
  <div v-for="(item, key, index) in this.mapController.maps" :key="'map_container_' + key">
    <keep-alive>
      <component v-if="this.mapController.isActive(key)" :is="item" :key="'map_' + key"
        :map="this.mapController.initMap(key)" :name="key" @vnode-mounted="onMounted" @vnode-unmounted="onUnMounted">
      </component>
    </keep-alive>
  </div>
  <div class="bottom-zoom">
    <ZoomControl />
  </div>
</template>
    
<script>
import maplibre from 'maplibre-gl';
import interact from 'interactjs';
import ZoomControl from '@/components/MainView/ZoomControl.vue';
import { defineAsyncComponent, markRaw } from 'vue'

const regexPattern = /\/src\/projects\/([^\/]+)\/Maps\/([^\/]+)\.vue/i;
const replacementString = "$1/$2";

const maps = import.meta.glob('@/projects/**/Maps/*.vue', {})
const lcKeys = Object.keys(maps).reduce(
  function (keys, k) {
    keys[k.replace(regexPattern, replacementString).toLowerCase()] = k;
    return keys
  }, {});
function getMap(key) { return maps[lcKeys[key.toLowerCase()]] };

const includesArray = (data, arr) => {
  return data.some(e => Array.isArray(e) && e.every((o, i) => Object.is(arr[i], o)));
}

class MapProxy extends maplibre.Map {
  constructor(...args) {
    super(...args);
  };

  mapInit(name) {
    this.name = name;
    this.prefix = name + "-";
    this.layers = this.layers || {};
    this.sources = this.sources || {};
    this.lazyVisibility = this.lazyVisibility || {};
    this.layers[name] = this.layers[name] || [];
    this.sources[name] = this.sources[name] || [];
    this.lazyVisibility[name] = this.lazyVisibility[name] || {};
    return this;
  }

  addSource(name, properties) {
    name = this.prefix + name;
    for (const source in this.sources) {
      if (this.sources[source].includes(name)) {
        return super.getSource(name)
      }
    }

    this.sources[this.name].push(name);
    return super.addSource(name, properties);
  };

  addLayer(properties) {
    properties.id = this.prefix + properties.id;
    properties.source = this.prefix + properties.source;
    this.layers[this.name].push(properties.id);
    const res = super.addLayer(properties);
    if (this.lazyVisibility[this.name][properties.id] == true) {
      this.setLayoutProperty(properties.id, 'visibility', 'visible');
    } else if (this.lazyVisibility[this.name][properties.id] == false) {
      this.setLayoutProperty(properties.id, 'visibility', 'none');
    }
    return res;
  }

  on(action, layer, cb) {
    if (!cb) {
      return super.on(action, layer, cb);
    } else {
      return super.on(action, this.prefix + layer, cb);
    }
  }

  hideLayer(layer, force_render = true, includes_prefix = false) {
    if (!includes_prefix) {
      layer = this.prefix + layer;
    }
    if (this.layers[this.name].includes(layer) == true) {
      if (this.lazyVisibility[this.name][layer] != true) {
        this.setLayoutProperty(layer, 'visibility', 'none');
      } else {
        delete this.lazyVisibility[this.name][layer];
      }
    } else {
      this.lazyVisibility[this.name][layer] = true;
    }
    console.log("hide", layer);
    if (force_render) {
      this._render();
    }
    return this;
  }

  showLayer(layer, force_render = true, includes_prefix = false) {
    if (!includes_prefix) {
      layer = this.prefix + layer;
    }
    if (this.layers[this.name].includes(layer) == true) {
      if (this.lazyVisibility[this.name][layer] != false) {
        this.setLayoutProperty(layer, 'visibility', 'visible');
      } else {
        delete this.lazyVisibility[this.name][layer];
      }
    } else {
      this.lazyVisibility[this.name][layer] = true;
    }
    console.log("show", layer)
    if (force_render) {
      this._render();
    }
    return this;
  }

  hideMapLayers() {
    if (this.name in this.layers) {
      this.layers[this.name].forEach(layer => {
        this.hideLayer(layer, false, true);
      });
    }
    this._render()
    return this;
  }

  showMapLayers() {
    if (this.name in this.layers) {
      this.layers[this.name].forEach(layer => {
        this.showLayer(layer, false, true);
      });
    }
    this._render();
    return this;
  }
}

class MapController {
  constructor(map, scope, mapLimit = 1) {
    this.map = map;
    this.maps = markRaw({});
    this.mapProxies = markRaw({});
    this.mapHistory = [];
    this.activeMaps = [];
    this.initMaps = [];
    this.mapLimit = mapLimit;
    this.scope = scope;
  }
  activateMap(name) {
    // Hide layers according to max layer limit
    if (this.mapHistory.length >= this.mapLimit & this.mapLimit != -1) {
      for (let map of this.mapHistory.slice(0, this.mapHistory.length - this.mapLimit + 1)) {
        this.deactivateMap(map);
      }
    }
    // Initialize new map & layer
    if (!(this.activeMaps.includes(name))) {
      if (!(name in this.maps)) {
        this.initMap(name);
      }
      // this.maps[name].show();
      this.mapHistory.push(name);
      this.activeMaps.push(name);
      console.log("Activate map", name);
    }
  }
  deactivateMap(name) {
    if (this.activeMaps.includes(name)) {
      this.activeMaps.splice(this.activeMaps.indexOf(name), 1);
      this.mapHistory = this.mapHistory.filter(i => i !== name);
      console.log("Deactivate map", name)
    }
  }
  toggleMap(name) {
    if (this.activeMaps.includes(name)) {
      this.deactivateMap(name);
    } else {
      this.activateMap(name);
    }
  }
  isActive(name) {
    return this.activeMaps.includes(name) | this.isInitMap(name);
  }
  isInitMap(name) {
    return this.initMaps.includes(name);
  }
  removeInitMap(name) {
    this.initMaps = this.initMaps.filter(i => i !== name);
  }
  setMapLimit(limit) {
    this.mapLimit = limit;
    return self
  }
  initMap(name) {
    if (!(name in this.mapProxies)) {
      this.mapProxies[name] = Object.assign(Object.create(
        MapProxy.prototype,
      ), this.map).mapInit(name);
      this.maps[name] = defineAsyncComponent(getMap(name.toLowerCase()).bind(this.scope));
      this.initMaps.push(name);
    }
    return this.mapProxies[name];
  }
}

export default {
  name: "Map",
  props: {
    map: { type: String, default: null },
    settings: { type: Object, default: null },
  },
  components: { ZoomControl },
  data() {
    return {
      mapController: { maps: [] }
    };
  },
  emits: ['map-controler-init'],
  computed: {
  },
  methods: {
    async onMounted(node) {
      this.mapController.removeInitMap(node.props.name);
      // this.mapController.initMap(node.key).showMapLayers();
    },
    async onUnMounted(node) {
      // this.mapController.initMap(node.key).hideMapLayers();
    }
  },
  async mounted() {
    // Create map
    this.settings.container = this.$refs.mapContainer
    let map = new maplibre.Map(this.settings);
    // Add attribute control
    map.addControl(new maplibre.AttributionControl(), "top-right");
    // Load map settings
    map.on("load", () => {

      // Add custom zoom functionality
      interact(".zoom-in").on("tap", () => {
        var currentZoom = map.getZoom();
        map.setZoom(currentZoom + 0.5);
      });
      interact(".zoom-out").on("tap", () => {
        var currentZoom = map.getZoom();
        map.setZoom(currentZoom - 0.5);
      });

      // Create map controler & load map
      this.mapController = new MapController(map, this);

      // Button Interactions
      interact(".layer-control").on("tap", (event) => {
        const el = event.target;
        const modes = ['n-layer-show', 'n-layer-hide', 'layer-show', 'layer-hide', 'layer-toggle'];
        let layer_stack = [];

        for (const attr of el.attributes) {
          //attribute part of modes
          const mode = attr.name;
          if (modes.includes(mode)) {
            // Get attribute
            for (const info of attr.value.split(";")) {
              const mapName = info.trim().split(":")[0];
              const layer = info.trim().split(":")[1];
              //Iterate over all commands to get initial layer state
              if (mode == 'layer-toggle') {
                const mapCtl = this.mapController.initMap(mapName);
                if (!this.mapController.isInitMap(mapName)) {
                  if (mapCtl.getLayoutProperty(mapCtl.prefix + layer, 'visibility') == 'visible') {
                    layer_stack.push([mapName, layer, 'hide']);
                  } else {
                    layer_stack.push([mapName, layer, 'show']);
                  }
                } else {
                  layer_stack.push([mapName, layer, 'show']);
                }
              } else if (mode == 'layer-show') {
                layer_stack.push([mapName, layer, 'show']);
              } else if (mode == 'layer-hide') {
                layer_stack.push([mapName, layer, 'hide']);
              } else if (mode == 'n-layer-show') {
                if (!includesArray(layer_stack, [mapName, null, 'showM'])) {
                  layer_stack.push([mapName, null, 'showM']);
                }
                if (layer != undefined) {
                  layer_stack.push([mapName, layer, 'hide']);
                }
              } else if (mode == 'n-layer-hide') {
                if (!includesArray(layer_stack, [mapName, null, 'hideM'])) {
                  layer_stack.push([mapName, null, 'hideM']);
                }
                if (layer != undefined) {
                  layer_stack.push([mapName, layer, 'show']);
                }
              }
            }
          }
        };

        //Apply layer changes
        for (const stack_item of layer_stack) {
          const mapCtl = this.mapController.initMap(stack_item[0]);
          if (stack_item[2] == "show") {
            mapCtl.showLayer(stack_item[1]);
          } else if (stack_item[2] == "hide") {
            mapCtl.hideLayer(stack_item[1]);
          } else if (stack_item[2] == "showM") {
            mapCtl.showMapLayers();
          } else if (stack_item[2] == "hideM") {
            mapCtl.hideMapLayers();
          }
        };

        this.mapController.map._render();
      })

      // Emit map controller
      this.$emit('map-controler-init', this.mapController);
      // Init initial map
      if (this.map) {
        this.mapController.initMap(this.map);
        this.mapController.activateMap(this.map);
      }
    });
  }
};



</script>
    
    
<style>
@import "maplibre-gl/dist/maplibre-gl.css";

.bottom-zoom {
  width: 60vw;
  position: fixed;
  left: 50%;
  transform: translateX(-50%);
  bottom: 22vh;
  display: flex;
  justify-content: space-between;
}

.map-title:empty {
  display: none;
}

.map-title {
  background-color: rgba(1, 73, 135, 0.6);
  width: fit-content;
  height: fit-content;
  padding: 5px;
  color: aliceblue;
  font-size: 24px;
  text-align: center;
  position: fixed;
  left: 50%;
  bottom: 24vh;
  transform: translateX(-50%);
}

.map-info:empty {
  display: none;
}

.map-info {
  background-color: aliceblue;
  opacity: 0.8;
  position: fixed;
  left: 50%;
  bottom: 23vh;
  transform: translateX(-50%);
  width: fit-content;
  display: flex;
  justify-content: space-evenly;
  font-size: 20px;
  padding: 8px;
  border-radius: 4px;
}

.map-footer:empty {
  display: none;
}

.map-footer {
  width: 100%;
  position: absolute;
  bottom: 5vh;
  display: flex;
  justify-content: space-evenly;
}
</style>