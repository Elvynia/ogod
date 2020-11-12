# OGOD - Of Games and Open Developments

## Principal goal

**Create a common way for all WebGL/JS graphic libraries to be wrapped and reused wisely through structured Web components, Rxjs and Web workers**
  - Using Hybrids.js to write extensible standard Web components (with native shadow DOM)
  - Using Rxjs to run reactive animationFrame update/render loop in a separated thread through a Worker that can reflect back updates in the main thread
  - Using Redux + redux-observable (Epic) to maintain a unique Store per engine/canvas, allowing components to build a full dynamic 2D/3D scene that can react to DOM events
  
## Long term goals :

- Build a plateform allowing community users to create web games using developed web components. Result game would come as pure HTML using OGOD custom elements. It will be easily sharable and could even work everywhere if the HTML code has CDN script imports.
- Create and gather a contributing community that develop Free/Open source gaming Web components
