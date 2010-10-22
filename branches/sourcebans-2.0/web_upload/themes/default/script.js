/**
 * =============================================================================
 * JavaScript functions and AJAX calls for "SourceBans Default" theme
 * 
 * @author InterWave Studios Development Team
 * @version 2.0.0
 * @copyright SourceBans (C)2009 InterWaveStudios.com.  All rights reserved.
 * @package SourceBans
 * @link http://www.sourcebans.net
 * 
 * @version $Id: sourcebans.js 24 2007-11-06 18:17:05Z olly $
 * =============================================================================
 */

/**
 * Global Variables
 */
var demo;
var override;
var search;


/**
 * Global Functions
 */
function ArchiveProtest(id, name)
{
  ShowBox('error', 'Archive Protest',    'Are you sure you want to archive the ban protest for "'    + name + '"?', 'Yes', 'No', function(){ x_ArchiveProtest(id, name, showConfirmation); });
}

function ArchiveSubmission(id, name)
{
  ShowBox('error', 'Archive Submission', 'Are you sure you want to archive the ban submission for "' + name + '"?', 'Yes', 'No', function(){ x_ArchiveSubmission(id, name, showConfirmation); });
}

function DeleteAdmin(id, name)
{
  ShowBox('error', 'Delete Admin',       'Are you sure you want to delete "'                         + name + '"?', 'Yes', 'No', function(){ x_DeleteAdmin(id, name, showConfirmation); });
}

function DeleteBan(id, name)
{
  ShowBox('error', 'Delete Ban',         'Are you sure you want to delete the ban for "'             + name + '"?', 'Yes', 'No', function(){ x_DeleteBan(id, name, showConfirmation); });
}

function DeleteGroup(id, name, type)
{
  ShowBox('error', 'Delete Group',       'Are you sure you want to delete the group: "'              + name + '"?', 'Yes', 'No', function(){ x_DeleteGroup(id, name, type, showConfirmation); });
}

function DeleteMod(id, name)
{
  ShowBox('error', 'Delete Mod',         'Are you sure you want to delete the mod: "'                + name + '"?', 'Yes', 'No', function(){ x_DeleteMod(id, name, showConfirmation); });
}

function DeleteProtest(id, name)
{
  ShowBox('error', 'Delete Protest',     'Are you sure you want to delete the ban protest for "'     + name + '"?', 'Yes', 'No', function(){ x_DeleteProtest(id, name, showConfirmation); });
}

function DeleteServer(id, name)
{
  ShowBox('error', 'Delete Server',      'Are you sure you want to delete the server: "'             + name + '"?', 'Yes', 'No', function(){ x_DeleteServer(id, name, showConfirmation); });
}

function DeleteSubmission(id, name)
{
  ShowBox('error', 'Delete Submission',  'Are you sure you want to delete the ban submission for "'  + name + '"?', 'Yes', 'No', function(){ x_DeleteSubmission(id, name, showConfirmation); });
}

function RestoreProtest(id, name)
{
  ShowBox('error', 'Restore Protest',    'Are you sure you want to restore the ban protest for "'    + name + '" from the archive?', 'Yes', 'No', function(){ x_RestoreProtest(id, name, showConfirmation); });
}

function RestoreSubmission(id, name)
{
  ShowBox('error', 'Restore Submission', 'Are you sure you want to restore the ban submission for "' + name + '" from the archive?', 'Yes', 'No', function(){ x_RestoreSubmission(id, name, showConfirmation); });
}

function ShowBox(type, title, text, txt_submit, txt_back, cb_submit, cb_back, time, redirect)
{
  if(txt_submit)
  {
    $('dialog-submit').removeEvents('click');
    $('dialog-submit').set({
      'events': {
        'click': function(e) {
          e.stop();
          if(typeof(cb_submit) == 'function')
            cb_submit();
          else if(redirect)
            window.location = redirect;
          else
            $('dialog').fade('out');
        }
      },
      'styles': {
        'display': 'inline'
      },
      'value': txt_submit
    });
  }
  else
    $('dialog-submit').setStyle('display', 'none');
  if(txt_back)
  {
    $('dialog-back').removeEvents('click');
    $('dialog-back').set({
      'events': {
        'click': function(e) {
          e.stop();
          if(typeof(cb_back) == 'function')
            cb_back();
          else
            $('dialog').fade('out');
        }
      },
      'styles': {
        'display': 'inline'
      },
      'value': txt_back
    });
  }
  else
    $('dialog-back').setStyle('display', 'none');
  
  $('dialog-title').set('text', title);
  $('dialog-text').set('html',  text);
  $('dialog').set('class', 'dialog-' + type).fade('in');
  
  if(time)
  {
    if(redirect)
      (function() {
        window.location = redirect;
      }).delay(time);
    else
      $('dialog-back').fireEvent('click').delay(time);
  }
}

function UnbanBan(id, name)
{
  ShowBox('info', 'Unban Reason', '<p>Please give the reason for unbanning "' + name + '":</p><textarea cols="40" id="ureason" name="ureason" rows="3"></textarea>', 'Unban', 'Back');
}

function UnbanBans(ids)
{
  ShowBox('info', 'Unban Reason', '<p>Please give the reason for unbanning these players:</p><textarea cols="40" id="ureason" name="ureason" rows="3"></textarea>', 'Unban', 'Back');
}


/*
 * sAJAX Callbacks
 */
function handleFormSubmit(res)
{
  if(!res)
    return;
  
  res = JSON.decode(res);
  if(res.error)
  {
    ShowBox('error', 'Error', res.error);
    return;
  }
  if(res.redirect)
    window.location = res.redirect;
}

function kickPlayer(res)
{
  if(res.error)
  {
    ShowBox('error', 'Failed to kick ' + res.name + '.', 'Failed to kick ' + res.name + '.', 'Ok', '', function(){ $('dialog').fade('out'); });
    return;
  }
  
  x_ServerInfo(res.id,    setServerInfo);
  x_ServerPlayers(res.id, setServerPlayers);
  ShowBox('ok', 'Kicked ' + res.name + '.', 'Successfully kicked ' + res.name + '.', 'Ok', '', function() { $('dialog').fade('out'); });
}

function setSelectTheme(res)
{
  if(res.error)
  {
    ShowBox('error', res.error, 'Ok', '', function(){ $('dialog').fade('out'); });
    return;
  }
  
  $('theme_author').set('text',  res.author);
  $('theme_link').set('text',    res.link);
  $('theme_name').set('text',    res.name);
  $('theme_version').set('text', res.version);
  $('current-theme-screenshot').set({
    'alt': res.name,
    'src': 'themes/' + res.theme + '/screenshot.jpg',
    'title': res.name
  });
}

function setServerAdmins(res)
{
  if(!res.admins.length)
    return;
  
  for(var id in res.admins)
  {
    var admin = res.admins[id];
    $('admin_' + id).setStyle('backgroundColor', '#dbf4d7');
  }
}

function setServerInfo(res)
{
  if(res.error)
  {
    $('host_' + res.id).set({
      'text': res.error,
      'styles': {
        'font-weight': 'bold'
      }
    });
    if($chk($('players_' + res.id)))
      $('players_' + res.id).set('text', 'N/A');
    if($chk($('map_'     + res.id)))
      $('map_'     + res.id).set('text', 'N/A');
    if($chk($('mapimg_'  + res.id)))
      $('mapimg_'  + res.id).set({
        'alt': 'Unknown',
        'src': 'images/maps/unknown.jpg',
        'title': 'Unknown'
      });
    if($chk($('vac_'     + res.id)))
      $('vac_'     + res.id).setStyle('display', 'none');
    if($chk($('os_'      + res.id)))
      $('os_'      + res.id).set({
        'alt': 'Unknown',
        'src': 'images/server_small.png',
        'title': 'Unknown'
      });
    return;
  }
  if($chk($('players_' + res.id)) && res.maxplayers > 0)
    $('players_' + res.id).set('text', res.numplayers + '/' + res.maxplayers);
  if($chk($('map_'     + res.id)) && res.map)
    $('map_'     + res.id).set('text', res.map);
  if($chk($('mapimg_'  + res.id)) && res.map_image != '')
    $('mapimg_'  + res.id).set({
      'alt': res.map,
      'src': res.map_image,
      'title': res.map
    });
  if($chk($('vac_'     + res.id)))
    $('vac_'     + res.id).setStyle('display', res.secure ? 'block' : 'none');
  if($chk($('os_'      + res.id)) && res.os)
  {
    $('os_'      + res.id).set('src', 'images/' + res.os + '.png');
    
    if(res.os == 'l')
      $('os_'    + res.id).set({
        'alt': 'Linux',
        'title': 'Linux'
      });
    if(res.os == 'w')
      $('os_'    + res.id).set({
        'alt': 'Windows',
        'title': 'Windows'
      });
  }
  
  $('host_'      + res.id).set({
    'html': res.hostname,
    'styles': {
      'font-weight': 'normal'
    }
  });
}

function setServerPlayers(res)
{
  if(res.players.length > 0)
  {
    var table = '<table class="listtable" width="100%"><tr><th>Name</th><th width="10%">Score</th><th width="40%">Time</th></tr>';
    for(var i = 0; i < res.players.length; i++)
    {
      var player = res.players[i];
      table += '<tr class="player_menu tbl_out" id="player_s'+res.id+'p'+player.index+'"><td class="listtable_1">' + player.name + '</td><td class="listtable_1">' + player.score + '</td><td class="listtable_1">' + player.time + '</td></tr>'
      
      new contextMenoo({
        fade: true,
        headline: "Player Commands",
        selector: '#player_s' + res.id + 'p' + player.index,
        className: 'playerlist_menu',
        menuItems: [
          {name: 'Kick', callback: function() { x_KickPlayer(res.id, player.name, kickPlayer); }},
          {name: 'Ban', callback: function() { x_BanPlayer(res.id, player.name, banPlayer); }},
          {separator: true},
          {name: 'View Profile', callback: function() { x_ViewProfile(res.id, player.name, ViewProfile); }},
          {name: 'Send Message', callback: function() { x_SendMessage(res.id, player.name, messageSent); }}
        ]
      });
    }
    $('playerlist_' + res.id).set('html', table + '</table>');
  }
  else
    $('playerlist_' + res.id).set('html', '<h3>No players in the server</h3>');
}

function setVersion(res)
{
  if(res.error)
  {
    $('relver').set('text', 'Error').setStyle('color', '#A00');
    $('versionmsg').set('text', res.error).setStyle('color', '#A00');
    return;
  }
  if(res.update)
    $('versionmsg').set('text', 'A new release is available.').setStyle('color', '#A00');
  else
    $('versionmsg').set('text', 'You have the latest release.').setStyle('color', '#0A0');
  
  $('relver').set('text', res.version);
  $('versionmsg').setStyle('fontWeight', 'bold');
}

function updateBanExpires(res)
{
  $('expires_' + res.id).set('text', res.expires);
}

function showConfirmation(res)
{
  if(res.error)
  {
    ShowBox('error', 'Error', res.message + res.error, 'Ok');
    return;
  }
  ShowBox('ok', res.title, res.message, 'Ok', false, false, false, 5000, res.redirect);
}

function clearCache(res)
{
  if(res.error)
  {
    ShowBox('error', 'Error', res.error, 'Ok');
    return;
  }
  $('clear_cache.msg').set('html', '<span style="color:green;">Cache cleared</span>');
}


/**
 * Global Events
 */
SWFAddress.addEventListener(SWFAddressEvent.CHANGE, function(e) {
  var active = window.location.hash.substring(1) || undefined;
  
  $$('*').each(function(el) {
    if(typeof(el.id) != 'string')
      return;
    
    // If tab was found, remove "active" class
    if(!el.id.indexOf('tab-'))
      el.removeClass('active');
    // If pane was found, hide it
    if(!el.id.indexOf('pane-'))
    {
      el.setStyle('display', 'none');
      
      if(!active)
        active = el.id.substring(5);
    }
  });
  
  if(!active)
    return;
  
  var name  = '';
  var panes = active.split('/');
  var pane, tab;
  for(var i in panes)
  {
    name += '-' + panes[i];
    tab   = $('tab'  + name);
    pane  = $('pane' + name);
    // If tab was found, add "active" class
    if($chk(tab))
      tab.addClass('active');
    // If pane was found, show it
    if($chk(pane))
      pane.setStyle('display', 'block');
  }
});

window.addEvent('domready', function() {
  $$('*').each(function(el) {
    if(typeof(el.id) != 'string')
      return;
    
    //if(!el.id.indexOf('expires_'))
    //  x_BanExpires.periodical(1000, el, [parseInt(el.id.substring(8)), parseInt(el.get('title')), updateBanExpires]);
    if(!el.id.indexOf('server_admins_'))
      x_ServerAdmins(parseInt(el.id.substring(14)),  setServerAdmins);
    if(!el.id.indexOf('host_'))
      x_ServerInfo(parseInt(el.id.substring(5)),     setServerInfo);
    if(!el.id.indexOf('playerlist_'))
      x_ServerPlayers(parseInt(el.id.substring(11)), setServerPlayers);
  });
  $$('form[method=post]').each(function(el) {
    el.addEvent('submit', function(e) {
      e.stop();
      SubmitForm(this, handleFormSubmit);
    });
  });
  $$('.back').each(function(el) {
    el.addEvent('click', function(e) {
      e.stop();
      SWFAddress.back();
    });
  });
  $$('.btn').each(function(el) {
    el.addEvents({
      'mouseout': function() {
        this.removeClass('btnhvr');
      },
      'mouseover': function() {
        this.addClass('btnhvr');
      }
    });
  });
  $$('.connect').each(function(el) {
    el.addEvent('click', function(e) {
      e.stop();
      window.location = 'steam://connect/' + this.get('rel');
    });
  });
  $$('.context-menu').each(function(el) {
    var contextmenu = new MooMenu(el);
    
    document.body.addEvent('click', function(e) {
      contextmenu.hide();
    });
    
    $$('td').each(function(el) {
      el.addEvent('contextmenu', function(e) {
        e.stop();
        
        // Check row's checkbox
        this.getParent().getChildren('td')[0].getChildren('input')[0].checked = true;
        // Show custom context menu
        contextmenu.show(e.page.y, e.page.x);
      });
    });
  });
  $$('.group_type_select').each(function(el) {
    el.addEvent('change', function(e) {
      el.getChildren('option').each(function(option) {
        var value = option.get('value');
        var type  = $('group_type_' + value);
        if($chk(type))
          type.slide(value == this.value ? 'in' : 'out');
      }.bind(this));
    });
    el.fireEvent('change');
  });
  $$('.refresh').each(function(el) {
    el.addEvent('click', function(e) {
      e.stop();
      
      var id = parseInt(this.get('rel'));
      x_ServerInfo(id,    setServerInfo);
      x_ServerPlayers(id, setServerPlayers);
    });
  });
  $$('.select_theme').each(function(el) {
    el.addEvent('click', function(e) {
      e.stop();
      x_SelectTheme(this.get('rel'), setSelectTheme);
    });
  });
  $$('.tbl_out').each(function(el) {
    el.addEvents({
      'mouseout': function() {
        this.addClass('tbl_out').removeClass('tbl_hover');
      },
      'mouseover': function(){
        this.addClass('tbl_hover').removeClass('tbl_out');
      }
    });
  });
  $$('.tips').each(function(el) {
    var title = el.get('title').split(' :: ');
    el.set('fade', {
      duration: 300
    }).store('tip:text',  title[1]).store('tip:title', title[0]);
  });
  $$('.toggle_mce').each(function(el) {
    el.addEvent('click', function(e) {
      e.stop();
      
      var id = this.get('rel');
      tinyMCE.execCommand(tinyMCE.getInstanceById(id) ? 'mceRemoveControl' : 'mceAddControl', false, id);
    });
  });
  
  if($$('div.opener').length  > 0)
    InitAccordion('tr.opener',   'div.opener',  'mainwrapper');
  if($$('div.opener2').length > 0)
    InitAccordion('tr.opener2',  'div.opener2', 'mainwrapper');
  if($$('div.opener3').length > 0)
    InitAccordion('tr.opener3',  'div.opener3', 'mainwrapper');
  if($$('tr.sea_open').length > 0)
    InitAccordion('tr.sea_open', 'form.panel',  'mainwrapper');
  
  if($chk($('action_select')))
  {
    $('action_select').addEvent('change', function(e) {
      alert(this.value);
    });
  }
  if($chk($('add_demo')))
  {
    demo = $('demo').clone();
    
    $('add_demo').addEvent('click', function(e) {
      e.stop();
      demo.clone().inject($('demo').removeProperties('id'), 'after').set('id', 'demo');
    });
  }
  if($chk($('add_override')))
  {
    override = $('override').clone();
    
    $('add_override').addEvent('click', function(e) {
      e.stop();
      override.clone().inject($('override').removeProperties('id'), 'after').set('id', 'override');
    });
  }
  if($chk($('admins_select')))
  {
    $('admins_select').addEvent('change', function(e) {
      $$('input[type=checkbox]').each(function(el) {
        el.checked = this.checked;
      }.bind(this));
    });
  }
  if($chk($('bans_select')))
  {
    $('bans_select').addEvent('change', function(e) {
      $$('input[type=checkbox]').each(function(el) {
        el.checked = this.checked;
      }.bind(this));
    });
  }
  if($chk($('clear_actions')))
    $('clear_actions').addEvent('click', function(e) {
      e.stop();
      ShowBox('error', 'Clear Actions', 'Are you sure you want to delete all of the actions?', 'Yes', 'No', function() { x_ClearActions(showConfirmation); });
    });
  if($chk($('clear_cache')))
    $('clear_cache').addEvent('click', function(e) {
      x_ClearCache(clearCache);
    });
  if($chk($('clear_logs')))
    $('clear_logs').addEvent('click', function(e) {
      e.stop();
      ShowBox('error', 'Clear Logs', 'Are you sure you want to delete all of the log entries?', 'Yes', 'No', function() { x_ClearLogs(showConfirmation); });
    });
  if($chk($('demo_howto')))
    $('demo_howto').addEvent('click', function(e) {
      e.stop();
      ShowBox('info', 'How To Record A Demo', 'While you are spectating the offending player, press the ` key on your keyboard. Then type record [demoname] and hit enter. Also type sb_status for extra information in SteamBans servers. The file will be in your mod folder.');
    });
  if($chk($('enable_smtp')))
  {
    $('enable_smtp').addEvent('change', function(e) {
      $('smtp_host').set('disabled',     !this.checked);
      $('smtp_port').set('disabled',     !this.checked);
      $('smtp_username').set('disabled', !this.checked);
      $('smtp_password').set('disabled', !this.checked);
      $('smtp_secure').set('disabled',   !this.checked);
    }).fireEvent('change');
  }
  if($chk($('identity-label')))
    $('auth').addEvent('change', function(e) {
      $('identity-label').set('text', this.options[this.selectedIndex].get('text'));
    });
  if($chk($('ip_count')))
  {
    $('ip').addEvent('keyup', function(e) {
      x_GetBans('ip', this.value, function(res) {
        var el = $('ip_count').set('text', res.count).getParent().getParent();
        el.set('title', el.get('text'));
      });
    });
  }
  if($chk($('permission_owner')))
  {
    $('permission_owner').addEvent('change', function(e) {
      $$('#group_type_web input[type=checkbox]').each(function(el) {
        el.checked = this.checked;
      }.bind(this));
    });
    $('permission_admins').addEvent('change', function(e) {
      UpdateCheckBox(this, 'permission_add_admins', 'permission_delete_admins', 'permission_edit_admins', 'permission_import_admins', 'permission_list_admins');
    });
    $('permission_bans').addEvent('change', function(e) {
      UpdateCheckBox(this, 'permission_add_bans', 'permission_delete_bans', 'permission_edit_all_bans', 'permission_edit_group_bans', 'permission_edit_own_bans', 'permission_import_bans', 'permission_unban_all_bans', 'permission_unban_group_bans', 'permission_unban_own_bans', 'permission_ban_protests', 'permission_ban_submissions');
    });
    $('permission_groups').addEvent('change', function(e) {
      UpdateCheckBox(this, 'permission_list_groups', 'permission_add_groups', 'permission_delete_groups', 'permission_edit_groups', 'permission_import_groups');
    });
    $('permission_mods').addEvent('change', function(e) {
      UpdateCheckBox(this, 'permission_list_mods', 'permission_add_mods', 'permission_edit_mods', 'permission_delete_mods');
    });
    $('permission_notify').addEvent('change', function(e) {
      UpdateCheckBox(this, 'permission_notify_prot', 'permission_notify_sub');
    });
    $('permission_servers').addEvent('change', function(e) {
      UpdateCheckBox(this, 'permission_list_servers', 'permission_add_servers', 'permission_edit_servers', 'permission_delete_servers', 'permission_import_servers');
    });
  }
  if($chk($('permission_root')))
  {
    $('permission_root').addEvent('change', function(e) {
      $$('#group_type_srv input[type=checkbox]').each(function(el) {
        el.checked = this.checked;
      }.bind(this));
    });
  }
  if($chk($('rcon')) && $chk($('rcon_confirm')))
  {
    MarkPasswordField($('rcon'));
    MarkPasswordField($('rcon_confirm'));
  }
  if($chk($('rcon_con')))
  {
    new Fx.Scroll($('rcon_out'), {
      duration: 500,
      transition: Fx.Transitions.Cubic.easeInOut
    }).toBottom();
    
    $('rcon_cmd').addEvent('keydown', function(e) {
      if(e.key != 'enter')
        return;
      if(this.value == 'clr')
      {
        $('rcon_out').empty();
        this.value    = '';
      }
      else
      {
        this.disabled = $('rcon_btn').disabled = true;
        this.value    = 'Executing, Please Wait...';
      }
    });
  }
  if($chk($('reason_other')))
  {
    $('reason').addEvent('change', function(e) {
      $('reason_other').setStyle('display', this.value == 'other' ? 'block' : 'none');
    }).fireEvent('change');
  }
  if($chk($('relver')))
    x_Version(setVersion);
  if($chk($('searchbox')))
  {
    search = $('searchbox').value;
    
    $('searchbox').addEvents({
      'blur': function(e) {
        if(this.value == '')
          this.value = search;
      },
      'focus': function(e) {
        this.value = '';
      }
    });
  }
  if($chk($('steam_count')))
  {
    $('steam').addEvent('keyup', function(e) {
      x_GetBans('steam', this.value, function(res) {
        var el = $('steam_count').set('text', res.count).getParent().getParent();
        el.set('title', el.get('text'));
      });
    });
  }
  
  $('dialog').fade('hide');
  
  new Drag('dialog', {
    handle: 'dialog-title'
  });
  new Tips('.tips',  {
    className: 'tipwrapper',
    onHide: function(tip) {
      tip.fade('out');
    },
    onShow: function(tip) {
      tip.fade('in');
    }
  });
  
  $$('.tipwrapper').each(function(el) {
    el.fade('hide');
  });
});


/**
 * TinyMCE
 */
tinyMCE.init({
  mode : 'exact',
  skin : 'o2k7',
  theme : 'advanced',
  plugins : 'inlinepopups,style,layer,table,save,advhr,advimage,advlink,emotions,iespell,insertdatetime,preview,zoom,media,contextmenu,paste,directionality,fullscreen,noneditable,visualchars,nonbreaking,xhtmlxtras',
  elements : 'intro_text,message',
  skin_variant : 'silver',
  theme_advanced_path : false,
  extended_valid_elements : 'a[name|href|target|title|onclick],img[class|src|alt|title|hspace|vspace|width|height|onmouseover|onmouseout|name],hr[class|width|size|noshade],font[face|size|color|style],span[class|align|style]',
  theme_advanced_buttons1 : 'bold,italic,underline,|,justifyleft,justifycenter,justifyright,justifyfull,|,fontselect,fontsizeselect',
  theme_advanced_buttons2 : 'cut,copy,paste,|,search,replace,|,bullist,numlist,|,outdent,indent,|,undo,redo,|,link,unlink,anchor,image,help,|,forecolor,backcolor',
  theme_advanced_buttons3 : 'tablecontrols,|,hr,removeformat,visualaid,|,charmap,emotions,iespell,media',
  theme_advanced_buttons4 : 'insertlayer,moveforward,movebackward,absolute,|,styleprops,|,cite,abbr,acronym,del,ins,|,visualchars,nonbreaking',
  theme_advanced_toolbar_align : 'left',
  theme_advanced_toolbar_location : 'top'
});