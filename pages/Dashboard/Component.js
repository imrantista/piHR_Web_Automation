import BasePage from '../BasePage';

export class ComponentPage extends BasePage {
  constructor(page, context) {
    super(page, context);
    this.page = page;
    this.context = context;
    this.onleaveTodayText = page.getByText("On leave today");
    this.onleaveTomorrowText = page.getByText("On leave tomorrow");

  }
async componentCheckAdmin(){
    await this.assert({
        locator: {
          default: this.onleaveTodayText,
        },
        state: 'visible',
        alias: 'On leave today Text visible'
      });
      await this.assert({
        locator: {
          default: this.onleaveTomorrowText,
        },
        state: 'visible',
        alias: 'On leave today Text visible'
      });
  }
  
}
