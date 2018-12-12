<?php
class Pages extends CI_Controller {

        public function view($page = 'home')
        {
        	 if ( ! file_exists(APPPATH.'views/pages/'.$page.'.php'))
		        {
		                // Whoops, we don't have a page for that!
		                show_404();
		        }



		        $data['title'] = strtolower($page); // ucfirst: Capitalize the first letter. strtolower: lowercarse.

		        //$this->load->helper('use_ssl');
		        //$this->load->helper('url');
		        //$this->load->helper('utility');
		        $this->load->helper('html');
		        $this->load->view('templates/header', $data);
		        $this->load->view('pages/'.$page, $data);
		        $this->load->view('templates/footer', $data);
        
        }     




}