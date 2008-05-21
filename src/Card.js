Ext.namespace('Ext.ux.Wiz');

/**
 * Licensed under GNU LESSER GENERAL PUBLIC LICENSE Version 3
 *
 * @author Thorsten Suckow-Homberg <ts@siteartwork.de>
 * @url http://www.siteartwork.de/wizardcomponent
 */

/**
 * @class Ext.ux.Wiz.Card
 * @extends Ext.FormPanel
 *
 * A specific {@link Ext.FormPanel} that can be used as a card in a 
 * {@link Ext.ux.Wiz}-component. 
 *
 * @constructor
 * @param {Object} config The config object 
 */ 
Ext.ux.Wiz.Card = Ext.extend(Ext.FormPanel, {
	
	/**
	 * @cfg {Boolean} header "True" to create the header element. Defaults to
	 * "false". See {@link Ext.form.FormPanel#header}
	 */
	header : false,
	
	/**
	 * @cfg {Strting} hideMode Hidemode of this component. Defaults to "offsets".
	 * See {@link Ext.form.FormPanel#hideMode}
	 */
	hideMode : 'offsets',
	
	/**
	 * Inits this component.
	 */
	initComponent : function()
	{
		this.on('beforehide', this.isValid, this);
		this.on('show', this.onCardShow, this);
		this.on('hide', this.onCardHide, this);
		
		Ext.ux.Wiz.Card.superclass.initComponent.call(this);
	},
	
// -------- helper
	isValid : function()
	{
		if (this.monitorValid) {
			return this.bindHandler();	
		}
		
		return true;
	},	
	
// -------- overrides	
    /**
     * Overrides parent implementation since we allow to add any element
     * in this component which must not be neccessarily be a form-element.
     * So before a call to "isValid()" is about to be made, this implementation
     * checks first if the specific item sitting in this component has a method "isValid"
     * to prevent errors.
     */
    bindHandler : function()
    {
        if(!this.bound){
            return false; // stops binding
        }
        var valid = true;
        this.form.items.each(function(f){
            if(f.isValid && !f.isValid(true)){
                valid = false;
                return false;
            }
        });
        if(this.buttons){
            for(var i = 0, len = this.buttons.length; i < len; i++){
                var btn = this.buttons[i];
                if(btn.formBind === true && btn.disabled === valid){
                    btn.setDisabled(!valid);
                }
            }
        }
        this.fireEvent('clientvalidation', this, valid);
    },
    
	/**
	 * Overrides parent implementation. This is needed because in case 
	 * this method uses "monitorValid=true", the method "startMonitoring" must
	 * not be called, until the "show"-event of this card fires. 
	 */
	initEvents : function()
	{
		var old = this.monitorValid;
		this.monitorValid = false;
        Ext.ux.Wiz.Card.superclass.initEvents.call(this);
		this.monitorValid = old;
    },

// -------- listener	
    /**
     * Stops monitoring the form elements in this component when the
     * 'hide'-event gets fired.
     */
	onCardHide : function()
	{
		if (this.monitorValid) {
			this.stopMonitoring();	
		}
	},

    /**
     * Starts monitoring the form elements in this component when the
     * 'show'-event gets fired.
     */
	onCardShow : function()
	{
		if (this.monitorValid) {
			this.startMonitoring();	
		}
	}
	
});