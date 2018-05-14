 //控制层 
app.controller('itemCatController' ,function($scope,$controller,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		itemCatService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		itemCatService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){				
		itemCatService.findOne(id).success(
			function(response){
				$scope.entity= response;					
			}
		);				
	}
	
	//保存 
	$scope.save=function(){				
		var serviceObject;//服务层对象  				
		if($scope.entity.id!=null){//如果有ID
			serviceObject=itemCatService.update( $scope.entity ); //修改  
		}else{
            $scope.entity.parentId=$scope.parentId;
			serviceObject=itemCatService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					//重新查询 
                    $scope.itemPaginationConf.totalItems=0;//触发分页重新加载
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		itemCatService.dele( $scope.selectIds ).success(
			function(response){
				if(response.success){
					$scope.reloadList();//刷新列表
				}						
			}		
		);				
	}
	
	$scope.searchEntity={};//定义搜索对象 
	
	//搜索
	$scope.search=function(page,rows){			
		itemCatService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
    //当前的父id
    $scope.parentId=0;
    //根据父id查找商品分类列表
	$scope.findByParentId=function (page,rows,parentId) {
		itemCatService.findByParentId(page,rows,parentId).success(function (response) {
            $scope.list=response.rows;
            $scope.itemPaginationConf.totalItems=response.total;//更新总记录数
        })
    }
    //面包屑当前级别
	$scope.grand=1;
	//修改当前级别
    $scope.setGrand = function (value) {
    	$scope.grand=value;
    };

    //面包屑记录逻辑
	$scope.selectList=function (p_entity) {
        $scope.parentId=p_entity.id;
        if ($scope.grand == 1) {
        	$scope.entity_1=null;
        	$scope.entity_2=null;
        }else if ($scope.grand == 2) {
        	$scope.entity_1=p_entity;
        	$scope.entity_2=null;
        }else if ($scope.grand == 3) {
        	$scope.entity_2=p_entity;
        }
        $scope.itemPaginationConf.totalItems=0;
    }
    //商品类别分页控件属性配置
    $scope.itemPaginationConf = {
        //当前页
        currentPage: 1,
        //总记录数
        // totalItems: 10,
        //每页查询的记录数
        itemsPerPage: 10,
        //分页选项，用于选择每页显示多少条记录
        perPageOptions: [10, 20, 30, 40, 50],
        //当页码变更后触发的函数
        onChange: function () {
            $scope.reloadItemList();//重新加载
        }
    };
    //商品类别重新加载数据
    $scope.reloadItemList = function () {
        //$scope.findPage($scope.paginationConf.currentPage, $scope.paginationConf.itemsPerPage);
        $scope.findByParentId($scope.itemPaginationConf.currentPage, $scope.itemPaginationConf.itemsPerPage,$scope.parentId);
        $scope.selectIds = [];
    }
    //查找所有模板
    $scope.findTemplates=function () {
        typeTemplateService.findAll().success(function (response) {
			$scope.temps=response;
        })
    }
});	
