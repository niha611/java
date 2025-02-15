package FILEOPERATIONS;

import java.io.File;

public class DeleteFile {
	
	
	public static void main(String[] args) {   
	    File f0 = new File("D:FileOperationExample.txt");   
	    if (f0.delete()) {   
	      System.out.println(f0.getName()+ " file is deleted successfully.");  
	    } else {  
	      System.out.println("Unexpected error found in deletion of the file.");  
	    }   
	    
	    
	  }   

}
