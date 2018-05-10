package com.pinyougou.sellergoods.service.impl;

import com.alibaba.dubbo.config.annotation.Service;
import com.github.abel533.entity.Example;
import com.github.pagehelper.PageHelper;
import com.github.pagehelper.PageInfo;
import com.pinyougou.mapper.TbBrandMapper;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import org.apache.commons.lang3.StringUtils;
import org.springframework.beans.factory.annotation.Autowired;

import java.util.Arrays;
import java.util.List;

/**
 * @author Steven
 * @version 1.0
 * @description com.pinyougou.sellergoods.service.impl
 * @date 2018-5-9
 */
@Service
public class BrandServiceImpl implements  BrandService{
    @Autowired
    private TbBrandMapper brandMapper;

    @Override
    public List<TbBrand> findAll() {
        return brandMapper.select(null);
    }

    @Override
    public PageResult<TbBrand> findPage(int pageNum, int pageSize ,TbBrand tbBrand) {
        PageResult<TbBrand> result = new PageResult<>();
        //设置分页条件
        PageHelper.startPage(pageNum,pageSize);
        //设置查询条件
        Example example = new Example(TbBrand.class);
        Example.Criteria criteria = example.createCriteria();
        if (tbBrand!=null){
            if (StringUtils.isNotBlank(tbBrand.getName())) {
                criteria.andLike("name", "%" + tbBrand.getName() + "%");
            }
            if (StringUtils.isNotBlank(tbBrand.getFirstChar())) {
                criteria.andLike("firstChar", "%" + tbBrand.getFirstChar() + "%");
            }
        }
        //查询数据
        List<TbBrand> brands = brandMapper.selectByExample(example);
        //保存数据列表
        result.setRows(brands);
        result.setTotal(new PageInfo<TbBrand>(brands).getTotal());
        return result;
    }

    @Override
    public void saveBrand(TbBrand tbBrand) {
        brandMapper.insertSelective(tbBrand);
    }

    @Override
    public TbBrand findById(Long id) {
        return brandMapper.selectByPrimaryKey(id);
    }

    @Override
    public void updateBrand(TbBrand tbBrand) {
        brandMapper.updateByPrimaryKeySelective(tbBrand);
    }

    @Override
    public void deleteBrand(Long[] ids) {
        List longs = Arrays.asList(ids);
        Example example = new Example(TbBrand.class);
        Example.Criteria criteria = example.createCriteria();
        criteria.andIn("id", longs);
        brandMapper.deleteByExample(example);
    }

}
