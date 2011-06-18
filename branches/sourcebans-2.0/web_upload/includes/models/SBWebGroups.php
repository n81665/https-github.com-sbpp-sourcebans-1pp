<?php
/**
 * SourceBans web groups model
 *
 * @author     SteamFriends, InterWave Studios, GameConnect
 * @copyright  (C)2007-2011 GameConnect.net.  All rights reserved.
 * @link       http://www.sourcebans.net
 * @package    SourceBans
 * @subpackage Web Groups
 * @version    $Id$
 */
class SBWebGroups extends BaseTableModel
{
  protected $_sort = 'name';
  
  
  function __construct()
  {
    parent::__construct();
    
    $this->_table = $this->_registry->db_prefix . 'groups';
  }
  
  
  protected function _fetch()
  {
    if(!empty($this->_data))
      return;
    
    parent::_fetch($this->_registry->one_minute * 5);
    
    $groups = array();
    foreach($this->_data as $row)
    {
      $group = new SBWebGroup();
      Util::object_set_values($group, $row);
      
      $groups[$row['id']] = $group;
    }
    
    $this->_data = $groups;
  }
}