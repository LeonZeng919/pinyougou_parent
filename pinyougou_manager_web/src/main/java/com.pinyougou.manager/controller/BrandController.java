package com.pinyougou.manager.controller;

import com.alibaba.dubbo.config.annotation.Reference;
import com.pinyougou.pojo.TbBrand;
import com.pinyougou.sellergoods.service.BrandService;
import entity.PageResult;
import entity.Result;
import org.apache.log4j.Logger;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

/**
 * 品牌请求处理器
 *
 * @author Steven
 */
@RestController
@RequestMapping("/brand")
public class BrandController {
    @Reference(timeout = 200000)
    private BrandService brandService;

    /**
     * 返回全部列表
     *
     * @return
     */
    @RequestMapping("/findAll")
    public List<TbBrand> findAll() {
        return brandService.findAll();
    }

    /**
     * 分页查找
     * @param page
     * @param size
     * @return
     */
    @RequestMapping("/findPage")
    public PageResult<TbBrand> findPage(Integer page, Integer size,@RequestBody TbBrand tbBrand) {
        return brandService.findPage(page, size,tbBrand);
    }

    Logger logger = Logger.getLogger(BrandController.class);
    @RequestMapping("add")
    public Result saveBrand(@RequestBody TbBrand tbBrand) {
        try {
            brandService.saveBrand(tbBrand);
            return new Result(true, "保存品牌成功");
        } catch (Exception e) {
            logger.error("保存品牌出现异常");
            return new Result(false, "保存品牌失败");
        }
    }

    @RequestMapping("findById")
    public TbBrand findById(Long id) {
        return brandService.findById(id);
    }

    @RequestMapping("update")
    public Result updateBrand(@RequestBody TbBrand tbBrand) {
        try {
            brandService.updateBrand(tbBrand);
            return new Result(true, "修改品牌成功");
        } catch (Exception e) {
            logger.error("修改品牌出现异常");
            return new Result(false, "修改品牌失败");
        }

    }

    /**
     * 删除品牌
     * @param ids
     */
    @RequestMapping("/delete")
    public Result deletBrand(Long[] ids) {
        try {
            brandService.deleteBrand(ids);
            return new Result(true, "删除品牌成功");
        } catch (Exception e) {
            logger.error("删除品牌发生异常");
            return new Result(false, "删除品牌失败");
        }
    }

}
