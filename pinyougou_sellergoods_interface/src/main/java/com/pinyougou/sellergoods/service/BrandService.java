package com.pinyougou.sellergoods.service;
import com.pinyougou.pojo.TbBrand;
import entity.PageResult;

import java.util.List;
/**
 * 品牌业务逻辑接口
 * @author Steven
 *
 */
public interface BrandService {
   /**
    * 查询所有品牌
    * @return
    */
   public List<TbBrand> findAll();

   /**
    * 分页查找所有品牌
    * @param pageNum
    * @param pageSize
    * @return
    */
   public PageResult<TbBrand> findPage(int pageNum, int pageSize ,TbBrand tbBrand);

   /**
    * 添加品牌
    * @param tbBrand
    */
   public void saveBrand(TbBrand tbBrand);

   /**
    * 根据id查找品牌
    * @param id
    * @return
    */
   public TbBrand findById(Long id);

   /**
    * 更新品牌
    * @param tbBrand
    */
   public void updateBrand(TbBrand tbBrand);

   /**
    * 删除品牌
    * @param ids
    */
   public void deleteBrand(Long[] ids);
}
