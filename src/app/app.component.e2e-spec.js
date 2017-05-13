describe('App', function () {

  beforeEach(function () {
    browser.get('/');
  });

  it('should have a title', function () {
    expect(browser.getTitle()).toEqual('Angular 2 | Pru');
  });

  it('should have <header>', function () {
    expect(element(by.css('pru-app header')).isPresent()).toEqual(true);
  });

  it('should have <main>', function () {
    expect(element(by.css('pru-app main')).isPresent()).toEqual(true);
  });

  it('should have a main title', function () {
    expect(element(by.css('main h1')).getText()).toEqual('Hello from Angular 2!');
  });

  it('should have <footer>', function () {
    expect(element(by.css('pru-app footer')).getText()).toEqual('© Prudential Financial');
  });

});
