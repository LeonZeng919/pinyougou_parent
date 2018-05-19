 //控制层 
app.controller('goodsController' ,function($scope,$controller,$location,goodsService,uploadService,itemCatService,typeTemplateService){
	
	$controller('baseController',{$scope:$scope});//继承 $scope,$controller,goodsService,uploadService,itemCatService,typeTemplateService
	
    //读取列表数据绑定到表单中  
	$scope.findAll=function(){
		goodsService.findAll().success(
			function(response){
				$scope.list=response;
			}			
		);
	}    
	
	//分页
	$scope.findPage=function(page,rows){			
		goodsService.findPage(page,rows).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	
	//查询实体 
	$scope.findOne=function(id){
        var id = $location.search()["id"];
        if (id == null) {
        	return;
        }
		goodsService.findOne(id).success(
			function(response){
				$scope.entity= response;
                //向富文本编辑器添加商品介绍
                editor.html($scope.entity.goodsDesc.introduction);

                //显示图片列表
                $scope.entity.goodsDesc.itemImages=
                    JSON.parse($scope.entity.goodsDesc.itemImages);
				//显示扩展属性pojo in entity.goodsDesc.customAttributeItems
                $scope.entity.goodsDesc.customAttributeItems=
                    JSON.parse($scope.entity.goodsDesc.customAttributeItems);
                //显示规格
                $scope.entity.goodsDesc.specificationItems=
					JSON.parse($scope.entity.goodsDesc.specificationItems);
                //sku列表转换
                for(var i=0;i<$scope.entity.itemList.length;i++){
                    $scope.entity.itemList[i].spec=JSON.parse($scope.entity.itemList[i].spec);
				}

            }
		);				
	}
	
	//保存 
	$scope.save=function(){
		//提取编辑器中的内容
        $scope.entity.goodsDesc.introduction = editor.html();
		var serviceObject;//服务层对象  				
		if($scope.entity.goods.id!=null){//如果有ID
			serviceObject=goodsService.update( $scope.entity ); //修改  
		}else{
			serviceObject=goodsService.add( $scope.entity  );//增加 
		}				
		serviceObject.success(
			function(response){
				if(response.success){
					alert(response.message)
					//清空页面实体
                    $scope.entity = {};
					//清空富文本编辑器
					editor.html('');
					//清空规格列表
                    $scope.specList={};
                    location.href = "goods.html";
				}else{
					alert(response.message);
				}
			}		
		);				
	}
	
	 
	//批量删除 
	$scope.dele=function(){			
		//获取选中的复选框			
		goodsService.dele( $scope.selectIds ).success(
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
		goodsService.search(page,rows,$scope.searchEntity).success(
			function(response){
				$scope.list=response.rows;	
				$scope.paginationConf.totalItems=response.total;//更新总记录数
			}			
		);
	}
	//上传图片
	$scope.uploadFile=function () {
		uploadService.uploadFile().success(function (response) {
            if (response.success) {
                $scope.image_entity.url=response.message;
            }else {
                alert(response.message);
			}
        }).error(function () {
            alert("上传发生错误");

        })
    }
    //t添加图片列表
	$scope.entity={goods:{},goodsDesc:{itemImages:[],specificationItems:[]}};
    $scope.add_image_entity=function () {
        $scope.entity.goodsDesc.itemImages.push($scope.image_entity);
    }
    //移除图片
	$scope.remove_image_entity=function (index) {
        $scope.entity.goodsDesc.itemImages.splice(index, 1);
    }
    //新建时，清空clear_image_entity
    $scope.clear_image_entity=function () {
		$scope.image_entity={};
        pre_image.src = "../../img/boxed-bg.png";
    }

    //读取一级分类列表
    $scope.selectItemCat1List = function () {
        itemCatService.findByParentId(0).success(function (response) {
            $scope.itemCat1List=response;
        })
    };
    //定义各级模板

	//读取二级分类列表
   $scope.$watch('entity.goods.category1Id',function (newValue,oldValue) {
       //判断newValue的值
       if (typeof(newValue)!="undefined"){
           //根据选择的至，查询二级分类
           itemCatService.findByParentId(newValue).success(function (response) {
               $scope.itemCat2List=response;
           })
           //修改模板id
           $scope.entity.goods.typeTemplateId = '';
           $scope.typeTemplate={};
           // console.log('entity.goods.category1Id:'+$scope.entity.goods.category1Id)
       }

   })
	//读取三级分类列表
    $scope.$watch('entity.goods.category2Id',function (newValue,oldValue) {
    	//判断newValue的值
        if (typeof(newValue)!="undefined"){
            //根据选择的至，查询二级分类
            itemCatService.findByParentId(newValue).success(function (response) {
                $scope.itemCat3List=response;
            })
            //修改模板id
            $scope.entity.goods.typeTemplateId = '';
            $scope.typeTemplate={};
            // console.log('entity.goods.category2Id:'+$scope.entity.goods.category2Id)
        }
    })
	//读取模板id
    $scope.$watch('entity.goods.category3Id',function (newValue,oldValue) {

        //判断newValue的值
        if (typeof(newValue)!="undefined"){
		itemCatService.findOne(newValue).success(function (response) {
			$scope.entity.goods.typeTemplateId=response.typeId;
		})
        // console.log('entity.goods.category3Id:'+$scope.entity.goods.category3Id)
        }
    })
	//根据模板读取所有品牌
	$scope.$watch('entity.goods.typeTemplateId',function (newValue,oldValue) {

		if (typeof(newValue)!="undefined"&&newValue!='') {
            typeTemplateService.findOne(newValue).success(function (response) {
                //获取类型模板
                $scope.typeTemplate=response;
                // console.log($scope.typeTemplate)
                $scope.typeTemplate.brandIds = JSON.parse($scope.typeTemplate.brandIds);
                if ($location.search()['id']==null) {
                    $scope.entity.goodsDesc.customAttributeItems = JSON.parse($scope.typeTemplate.customAttributeItems);
				}


            })
            typeTemplateService.findSpecList(newValue).success(function (response) {
            	$scope.specList=response;
            });

		}

    })
	//选中规格选项
	$scope.updateSpecAttribute=function ($event,name,value) {
        var object = $scope.searchObjectByKey($scope.entity.goodsDesc.specificationItems, 'attributeName', name);

        if (object != null) {
            if ($event.target.checked) {
                object.attributeValue.push(value);
            } else {//取消勾选
                object.attributeValue.splice(object.attributeValue.indexOf(value), 1);//移除选项

				//如果都取消了，移除记录
                if (object.attributeValue.length == 0) {
                    $scope.entity.goodsDesc.specificationItems.splice($scope.entity.goodsDesc.specificationItems.indexOf(object), 1);

                }

            }
            console.log(name+"在specificationItems的 index:"+$scope.entity.goodsDesc.specificationItems.indexOf((object)));

        }else {
        	$scope.entity.goodsDesc.specificationItems.push(
				{"attributeName":name,"attributeValue":[value]}
			)
		}


    }

    //创建sku列表
	$scope.createItemList=function () {

		var items=$scope.entity.goodsDesc.specificationItems;
		if (items.length>0){
            $scope.entity.itemList=[{spec:{},price:0,num:99999,status:'0', isDefault: '0'}]
            for (var i=0;i<items.length;i++){
                $scope.entity.itemList = addColumn($scope.entity.itemList, items[i].attributeName, items[i].attributeValue);
            }
		}else {
            $scope.entity.itemList = [];
		}

    }
    //定义一个添加列的方法
	//list格式[{"attributeName":"网络","attributeValue":["移动3G","移动4G"]},{"attributeName":"机身内存","attributeValue":["16G"]}]
	//newList格式[{spec:{},price:0,num:99999,status:'0', isDefault: '0'}]
	addColumn=function (list,columnName,columnValue) {
        var newList = [];//新的集合
		//遍历每个规格
		for (var i=0;i<list.length;i++){
            var oldRow = list[i];
            //遍历遍历每个规格的选项
            for (var j=0;j<columnValue.length;j++){
            	var newRow=JSON.parse(JSON.stringify(oldRow))//深克隆
                newRow.spec[columnName] = columnValue[j];
                newList.push(newRow);
			}
		}
		return newList;
    }
    //定义商品状态
    $scope.status = ['未审核', '已审核', '审核未通过', '关闭'];

   //加载商品分类列表
    $scope.itemCatList = [];
    $scope.findItemCatList=function () {
		itemCatService.findAll().success(function (response) {
			for(var i=0;i<response.length;i++){
                $scope.itemCatList[response[i].id] = response[i].name;
			}
        })
    }
    //根据规格名称和选项名称返回是否被勾选
	$scope.checkAttributeValue=function (specName,optionName) {
		var items=$scope.entity.goodsDesc.specificationItems;
		var object=$scope.searchObjectByKey(items,'attributeName',specName);
        if (object == null) {
        	return false;
        }else {
            if (object.attributeValue.indexOf(optionName) >= 0) {
            	return true;
            }else {
            	return false;
			}
		}
    }
});	
