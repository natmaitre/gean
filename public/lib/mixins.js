var mixins = {
  addMenuOption: function(text, callback, className) {
    className || (className = this.menuConfig.className || 'default');

    var x = this.menuConfig.startX === "center" ?
      game.world.centerX :
      this.menuConfig.startX;

    var y = this.menuConfig.startY;
    var txt = game.add.text(
      x,
      (this.optionCount * 80) + y,
      text,
      style.navitem[className]
    );

    txt.anchor.setTo(this.menuConfig.startX === "center" ? 0.5 : 0.0);
    txt.inputEnabled = true;

    txt.events.onInputUp.add(callback);
    txt.events.onInputOver.add(function (target) {
      target.setStyle(style.navitem.hover);
    });
    txt.events.onInputOut.add(function (target) {
      target.setStyle(style.navitem[className]);
    });

    this.optionCount ++;
  }
};
