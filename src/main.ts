import { GridTest } from './app/GridTest';

// depending on the env mode, enable prod mode or add debugging modules
if (process.env.ENV === 'build') {
  // enableProdMode();
}

export function main() {
  // return platformBrowserDynamic().bootstrapModule(AppModule);
  console.info('instantiating grid')
  new GridTest();
}

if (document.readyState === 'complete') {
  main();
} else {
  document.addEventListener('DOMContentLoaded', main);
}
